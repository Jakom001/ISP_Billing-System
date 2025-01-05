const Joi = require('joi');

const userSchema = Joi.object({
    type: Joi.string().valid("pppoe", "hotspot").required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).optional().allow(""),
    username: Joi.string().min(3).required(),
    userPaass: Joi.string().min(6).required(),
    packageId: Joi.string().required(),
    email: Joi.string()
        .optional() 
        .allow(""),
    connectionExpiryDate: Joi.date().iso().optional(),
    phoneNumber: Joi.string().min(10).required(),
    comment: Joi.string().optional().allow(""),
    address: Joi.string().optional().allow(""),
    balance: Joi.number().optional(),
    totalAmountPaid: Joi.number().optional(),
})

const packageSchema = Joi.object({
    packageName: Joi.string().required(),
    price: Joi.number().required(),
    type: Joi.string().valid("pppoe", "hotspot").required(),
    uploadSpeed: Joi.string()
        .pattern(/^\d+M$/) 
        .required()
        .messages({
            "string.pattern.base": "Enter a valid Upload speed e.g., 10M.",
        }),
    downloadSpeed: Joi.string()
        .pattern(/^\d+M$/)
        .required()
        .messages({
            "string.pattern.base": "Enter a valid Download speed e.g., 10M.",
        }),
})

const paymentSchema = Joi.object({
    amount: Joi.number().required(),
    paymentMethod: Joi.string().valid("cash", "bank", "mpesa").required(),
    paymentDate: Joi.date().iso().required(),
    userId: Joi.string().required(),
    comment: Joi.string().optional().allow(""),
    receiptNumber: Joi.string().required(),
    checked: Joi.string().valid("yes", "no").required(),
    

    
})

module.exports = {
    userSchema,
    packageSchema,
    paymentSchema
};

