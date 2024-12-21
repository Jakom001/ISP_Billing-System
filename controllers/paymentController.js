const Payment = require("../controllers/Payment")
const paymentSchema = require("../middlewares/validator")

const getPayments = async (req, res) => {
    try {
        const result = await Payment.find();
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
         user,
         comment,
         receiptNumber,
         paymentStatus,
         checked,
   } = req.body;

   try{
    const { error, value } = paymentSchema.validate({
        amount,
        paymentMethod,
        paymentDate,
        user,
        comment,
        receiptNumber,
        paymentStatus,
        checked,
    });

    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    const payment = new Payment(
        {
            amount,
            paymentMethod,
            paymentDate,
            user,
            comment,
            receiptNumber,
            paymentStatus,
            checked,
        }
    );
    const result = await payment.save();
    res.status(201).json({ success: true, message: "Payment created", data: result });

   }
    catch (error) {
     res.status(400).json({
          success: false,
          message: "Error creating payment",
          error: error.message,
     });
    }
}

const updatePayment = async (req, res) => {
    const {
        amount,
        paymentMethod,
        paymentDate,
        user,
        comment,
        receiptNumber,
        paymentStatus,
        checked,
    } = req.body;

    try {
        const { error, value } = paymentSchema.validate({
            amount,
            paymentMethod,
            paymentDate,
            user,
            comment,
            receiptNumber,
            paymentStatus,
            checked,
        });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        
        const result = await Payment.findByIdAndUpdate(req.params.id, 
            {
                amount,
                paymentMethod,
                paymentDate,
                user,
                comment,
                receiptNumber,
                paymentStatus,
                checked,
            },
            { new: true });
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