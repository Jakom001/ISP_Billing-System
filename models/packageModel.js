const { timeStamp } = require("console");
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        require: [true, "packageName is required"],
        trim: true,
        lowercase: true,
    },
    price: {
        type: Number,
        require: [true, "price is required"],
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
    uploadSpeed: {
        type: String,
        trim: true,
        require: [true, "uploadSpeed is required"],
    },
    downloadSpeed: {
        type: String,
        trim: true,
        require: [true, "downloadSpeed is required"],
    },
},
{
    timestamps: true
})

const Package = mongoose.model("Package", packageSchema)

module.exports = Package