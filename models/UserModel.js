const { timeStamp } = require("console");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: [true, "firstName is required"],
        trim: true,
        titlecase: true,
    },
    lastName: {
        type: String,
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        require: [true, "userName is required"],
        trim: true,
        unique: true,
    },
    type: {
        type: String,
        require: [true, "type is required"],
        enum: ["pppoe", 'hotspot'],
        trim: true,
    },
    userPassw: {
        type: String,
        require: [true, "UserPassword is required"],
        select:true,
        minlength: [6, "UserPassowrd must be atleast 8 characters"]
    },
    
    package: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Package",
        require: [true, "package is required"],
    },
    email: {
        type: String,
        require: false,
        trim: true,
        lowercase: true,
        sparse: true,
        
    },
    phoneNumber: {
        type: String,
        require: [true, "Phone number is required"],
        trim: true,
        lowercase: true,
        unique: true,
        match: /^\+\d{1,3}\s\(\d{3}\)\s\d{3}-\d{4}$/
    },
    address: {
        type: String,
        
    },
    comment: {
        type: String,
    },
    isConnected:{
        type: Boolean,
        default: false,
    },
    connectionExpiryDate:{
        type: Date,
        default: null,
    },
    balance:{
        type: Number,
        default: 0,
    },
    totalAmountPaid:{
        type: Number,
        default: 0,
    },
    lastReminderSent:{
        type: Date,
        default: null,
    }
},
{
    timestamps: true
})



const User = mongoose.model("User", userSchema)

module.exports = User