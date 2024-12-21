const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  receiptNumber: {
    type: String,
    required: [true, 'Please add a receipt number'],
  },
  paymentDate: {
    type: Date,
    required: [true, 'Please add a payment date'],
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
    },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mpesa', 'bank'],
    required: true,
  },
  checked: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no',
  },
    comment: {
        type: String,
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
