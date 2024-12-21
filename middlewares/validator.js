const Joi = require('joi');

const userSchema = Joi.object({
    type: Joi.string().valid("PPPoE", "Hotspot").required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    username: Joi.string().alphanum().min(3).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({ "any.only": "Passwords must match" }),
    package: Joi.string().required(),
    email: Joi.string().email().required(),
    expiryDate: Joi.date().iso().required(),
    phoneNumber: Joi.string().min(10).required(),
    address: Joi.string().optional(),
    comment: Joi.string().optional(),    
})

const packageSchema = Joi.object({
    packageName: Joi.string().required(),
    price: Joi.number().required(),
    type: Joi.string().valid("PPPoE", "Hotspot").required(),
    uploadSpeed: Joi.string().required(),
    downloadSpeed: Joi.string().required(),
})

const paymentSchema = Joi.object({
    amount: Joi.number().required(),
    paymentMethod: Joi.string().valid("cash", "bank", "mpesa").required(),
    paymentDate: Joi.date().iso().required(),
    user: Joi.string().required(),
    comment: Joi.string().optional(),
    receiptNumber: Joi.string().required(),
    paymentStatus: Joi.string().valid("paid", "unpaid").required(),
    checked: Joi.string().valid("yes", "no").required(),
})

module.exports = {
    userSchema,
    packageSchema,
    paymentSchema
};

