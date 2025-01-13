const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        require: [true, "packageName is required"],
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        require: [true, "price is required"],
        trim: true,
    },
    type: {
        type: String,
        require: [true, "type is required"],
        enum: ["pppoe", 'hotspot'],
        default: 'pppoe',
        trim: true,
    },
    uploadSpeed: {
        type: String,
        trim: true,
        require: [true, "uploadSpeed is required"],
        uppercase: true,
    },
    downloadSpeed: {
        type: String,
        trim: true,
        require: [true, "downloadSpeed is required"],
        uppercase: true,

    },
},
{
    timestamps: true
})

const Package = mongoose.model("Package", packageSchema)

module.exports = Package