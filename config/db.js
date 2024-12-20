const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/isp_billing_system");
        console.log("MongoDb Connected Successfully")
    }catch(error){
        console.error("MongoDB connection failed:", error.message);
        process.exit(1)
    }
}

module.exports = connectDB