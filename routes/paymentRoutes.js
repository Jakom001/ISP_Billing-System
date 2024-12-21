const express = require('express');
const router = express.router();
const paymentController = require('../controllers/paymentController');

// Get all payments
router.get('/all-payments', paymentController.getPayments);

// Add a new payment
router.post('/add-payment', paymentController.createPayment);

// Update a payment
router.post('/update-payment', paymentController.updatePayment);

// Delete a payment

router.delete('/delete-payment/:id', paymentController.deletePayment);

// Get a single payment

router.get('/single-payment/:id', paymentController.getPaymentById);

module.exports = router;
