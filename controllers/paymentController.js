const Payment = require("../models/paymentModel");
const User = require("../models/userModel");

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

   try{
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
    
    const payingUser = await User.findById(userId).populate({
        path: "package",
        select: "price",
    });
    if (!payingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    const payment = new Payment(
        {
            amount,
            paymentMethod,
            paymentDate,
            user: userId,
            comment,
            receiptNumber,
            checked,
        }
    );
    const result = await payment.save();
    payingUser.balance +=  Number(amount);
    payingUser.totalAmountPaid +=  Number(amount);

    if (payingUser.balance >= payingUser.package.price && (!payingUser.connectionExpiryDate || payingUser.connectionExpiryDate < new Date())) {
        payingUser.balance -= payingUser.package.price;

        const now = new Date();
        now.setHours(23, 59, 59, 999);
        payingUser.connectionExpiryDate = new Date(now.setDate(now.getDate() + 30));
        payingUser.isConnected = true;
    }
    
    await payingUser.save();

    res.status(201).json({ success: true, message: "Payment processed", data: result });    
    
   }
    catch (error) {
     res.status(500).json({
          success: false,
          message: "Error processing payment",
          error: error.message,
     });
    }
}

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

            const connectionExpiry = new Date(paymentDate);
            connectionExpiry.setDate(connectionExpiry.getDate() + 30);
            user.isConnected = true;
            user.balance += amount;
            user.connectionExpiryDate = connectionExpiry;
            await user.save();
        
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
        const result = await Payment.findById(req.params.id);
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