const cron = require("node-cron");
const User = require("../models/userModel");
const Package = require("../models/packageModel");

const checkAndDeductUserBalance = async () => {
    try{
        const now = new Date();
        now.setHours(23, 59, 59, 999); 

        const expiredUsers = await User.find({
            connectionExpiryDate: { $lte: now }
        }).populate({
            path: "package",
            select: "price"
        });
    
        if (expiredUsers.length === 0){
            console.log("No users found with expired connection date");
            return;
        }

        for (const user of expiredUsers){
            const packagePrice = user.package.price;

            if (user.balance >= packagePrice){
                user.balance -= packagePrice;
                user.connectionExpiryDate = new Date(now.setDate(now.getDate() + 30));
                user.isConnected = true;
                console.log(`User ${user.username} has been connected. Balance: ${user.balance}`);
            }
            else{
                user.isConnected = false;
                user.connectionExpiryDate = null;
                console.log(`User ${user.username} disconnected due to insufficient balance. Balance: ${user.balance}`);
            }
            await user.save();
        }

    }catch(error){
        console.error("Error checking user connections:", error.message);
    }
};

const initializeCronjobs = () => {
    // Run the checkUserConnection function every day at 11:57 PM
    cron.schedule("57 23 * * *", async () => {
        console.log("Running connection check and balance deduction");
        await checkAndDeductUserBalance();
    });       
};


module.exports = {initializeCronjobs};