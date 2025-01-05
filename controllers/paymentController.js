require('dotenv').config()
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const RouterOSAPI = require('node-routeros').RouterOSAPI;


function getRouterConnection(){
    return  new RouterOSAPI({
        host: process.env.MIKROTIK_HOSsT,
        user: process.env.MIKROTIK_USER,
        password: process.env.MIKROTIK_PASSWORD,
        port: process.env.MIKROTIK_PORT,
    });
}

const { paymentSchema } = require("../middlewares/validator")

const getPayments = async (req, res) => {
    try {
        const result = await Payment.find().populate({
            path: "user",
            select: "username phoneNumber",
        });
        res.status(200).json({ success: true, message: "payments", data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving payments",
            error: error.message,
        });
    }
};


const createPayment = async (req, res) => {
    const {
        amount,
        paymentMethod,
        paymentDate,
        userId,
        comment,
        receiptNumber,
        checked,
    } = req.body;

    try {
        const { error } = paymentSchema.validate({
            amount,
            paymentMethod,
            paymentDate,
            userId,
            comment,
            receiptNumber,
            checked,
        });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const payingUser = await User.findById(userId).populate({
            path: "package",
            select: "price",
        });

        if (!payingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const payment = new Payment({
            amount,
            paymentMethod,
            paymentDate,
            user: userId,
            comment,
            receiptNumber,
            checked,
        });

        const result = await payment.save();
        res.status(201).json({message: "User payment add successfully", data: result});
        
       
        payingUser.balance += Number(amount);
        payingUser.totalAmountPaid += Number(amount);

        const now = new Date();
        now.setHours(23, 59, 59, 999);

        if (
            payingUser.balance >= payingUser.package.price &&
            (!payingUser.connectionExpiryDate || payingUser.connectionExpiryDate < now)
        ) {
            payingUser.balance -= payingUser.package.price;

            const datePaid = new Date(paymentDate);
            datePaid.setHours(23, 59, 59, 999);
            payingUser.connectionExpiryDate = new Date(datePaid.setDate(datePaid.getDate() + 30));
            payingUser.isConnected = true;

            // MikroTik Logic to Enable User
            try {
                const connection = getRouterConnection();
                await connection.connect();

                // Find the user's PPPoE secret
                const secrets = await connection.write('/ppp/secret/print', [
                    '=.proplist=.id',
                    '?name=' + payingUser.username
                ]);

                if (secrets.length > 0) {
                    // Enable the PPPoE secret
                    await connection.write('/ppp/secret/set', [
                        '=.id=' + secrets[0]['.id'],
                        '=disabled=no'
                    ]);

                    // Remove any active connections to force reconnection
                    const active = await connection.write('/ppp/active/print', [
                        '?name=' + payingUser.username
                    ]);

                    if (active.length > 0) {
                        await connection.write('/ppp/active/remove', [
                            '=.id=' + active[0]['.id']
                        ]);
                    }
                }

                connection.close();
                res.status(201).json({message: "User Enabled successfully in Mikrotik",});


            } catch (mikrotikError) {
                console.error("Error interacting with MikroTik:", mikrotikError);
                return res.status(500).json({ success: false, message: "Error enabling user connection on MikroTik" });
            }
        }

        await payingUser.save();
        res.status(201).json({ success: true, message: "Payment processed and user connection updated"});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error processing payment",
            error: error.message,
        });
    }
};

 

const updatePayment = async (req, res) => {
    const {
        amount,
        paymentMethod,
        paymentDate,
        userId,
        comment,
        receiptNumber,
        checked,
    } = req.body;

    try {
        const { error, value } = paymentSchema.validate({
            amount,
            paymentMethod,
            paymentDate,
            userId,
            comment,
            receiptNumber,
            checked,
        });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const result = await Payment.findByIdAndUpdate(req.params.id, 
            {
                amount,
                paymentMethod,
                paymentDate,
                user: userId,
                comment,
                receiptNumber,
                checked,
            },
            { new: true });
            if (!result) {
                return res.status(404).json({ success: false, message: "Payment not found" });
            }

            // const connectionExpiry = new Date(paymentDate);
            // // user.balance += amount;
            // connectionExpiry.setHours(23, 59, 59, 999);
            // user.connectionExpiryDate = new Date(connectionExpiry.setDate(connectionExpiry.getDate() + 30));
            // await user.save();
        
    res.status(200).json({ success: true, message: "Payment updated", data: result });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating payment",
            error: error.message,
        });
    }
};

const deletePayment = async (req, res) => {
    try {
        const result = await Payment.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }
        res.status(200).json({ success: true, message: "Payment deleted", data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting payment",
            error: error.message,
        });
    }
};

const getPackageById = async (req, res) => {
    try {
        const result = await Payment.findById(req.params.id).populate({
            path: "user",
            select: "username",
        });
        if (!result) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }
        res.status(200).json({ success: true, message: "Payment", data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving payment",
            error: error.message,
        });
    }
};


module.exports = {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
    getPackageById,
};