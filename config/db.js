const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/isp_billing_system")
    }catch(error){
        console.error("MongoDB connection failed:", error.message);
        process.exit(1)
    }
}

module.exports = connectDB