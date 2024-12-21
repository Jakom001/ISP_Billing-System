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

module.exports = userSchema;

module.exports = packageSchema;
