const { timeStamp } = require("console");
const mongoose = require("mongoose");
const {isEmail} = require("validator")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: [true, "firstName is required"],
        trim: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        require: [true, "lastName is required"],
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        require: [true, "userName is required"],
        trim: true,
        lowercase: true,
    },
    type: {
        type: String,
        require: [true, "type is required"],
        enum: ["PPPoE", 'Hotspot'],
        default: 'PPPoE',
        trim: true,
        
    },
    firstName: {
        type: String,
        require: [true, "firstName is required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: [true, "ConfirmPassword is required"],
        trim: true,
        select:false,
        minlength: [6, "password must be atleast 8 characters"]
    },
    
    package: {
        type: String,
        require: [true, "package is required"],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        require: [true, "email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    expiryDate: {
        type: Date,
        require: [true, "expiryDate is required"],
        trim: true,
        lowercase: true,
       
    },
    phoneNumber: {
        type: String,
        require: [true, "Phone number is required"],
        trim: true,
        lowercase: true,
        unique: true,
    },
    address: {
        type: String,
        require: [true, "firstName is required"],
        trim: true,
        lowercase: true,
    },
    comment: {
        type: String,
        require: [true, "comments is required"],
        trim: true,
        lowercase: true,
    },
    isActive:{
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User