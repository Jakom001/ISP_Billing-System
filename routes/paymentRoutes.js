const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Get all payments
router.get('/all-payments', paymentController.getPayments);

// Add a new payment
router.post('/add-payment', paymentController.createPayment);

// Update a payment
router.put('/update-payment/:id', paymentController.updatePayment);

// Delete a payment

router.delete('/delete-payment/:id', paymentController.deletePayment);

// Get a single payment

router.get('/single-payment/:id', paymentController.getPackageById);

module.exports = router;
