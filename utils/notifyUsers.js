const cron = require("node-cron");
const User = require("../models/userModel");
const { sendEmailNotification, sendSMSNotification } = require("../utils/notification");
const packagePrices = require("../utils/packages");

const notifyUsers = async () => {
    try {
      const now = new Date();
      const users = await User.find({ connectionExpiry: { $gte: now } });
  
      for (const user of users) {
        const daysRemaining = Math.ceil((user.connectionExpiry - now) / (1000 * 60 * 60 * 24));
        const packagePrice = packagePrices[user.package];
  
        if (user.balance < packagePrice) {
          let message = `Reminder: Your balance of ${user.balance} is insufficient for the ${user.package} package (price: ${packagePrice}).`;
  
          if (daysRemaining === 5 || daysRemaining === 3 || daysRemaining === 1 || daysRemaining === 0) {
            message += ` You have ${daysRemaining} day(s) left before your connection expires. Please top up to avoid disconnection.`;
            
            // Avoid duplicate notifications
            if (!user.lastReminderSent || new Date(user.lastReminderSent).toDateString() !== now.toDateString()) {
              // Send Email
              await sendEmailNotification(user, message);
  
              // Send SMS
              await sendSMSNotification(user, message);
  
              // Update lastReminderSent
              user.lastReminderSent = now;
              await user.save();
            }
          }
        }
  
        // Expiry Logic at 11:59 PM
        if (daysRemaining === 0 && now.getHours() === 23 && now.getMinutes() === 59) {
          user.isConnected = false; // Disconnect the user
          user.connectionExpiry = null;
          await user.save();
          console.log(`User ${user.username} has been disconnected due to insufficient balance.`);
        }
      }
    } catch (error) {
      console.error("Error sending notifications:", error.message);
    }
  };
  
  // Schedule job to run daily
  cron.schedule("0 0 * * *", async () => {
    console.log("Running user notifications...");
    await notifyUsers();
  });