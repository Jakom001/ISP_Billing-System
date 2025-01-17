const cron = require("node-cron");
const User = require("../models/userModel");
const { sendEmailNotification, sendSMSNotification } = require("../utils/notification");

const notifyUsers = async () => {
  let subject = "Wifi Suscription Expiry Reminder";
    try {
      const now = new Date();
      const users = await User.find({ connectionExpiryDate: { $gte: now } }).populate({
        path: "package",
        select: "packageName price"
      });
  
      for (const user of users) {
        const daysRemaining = Math.ceil((user.connectionExpiryDate - now) / (1000 * 60 * 60 * 24));
        const packagePrice = user.package.price;
  
        if (user.balance < packagePrice) {
          let message = `Dear ${user.firstName}, your ${user.package.packageName}S internet package subscription expires in `;
  
          if (daysRemaining === 5 || daysRemaining === 3 || daysRemaining === 1 || daysRemaining === 0 ) {
            message += `${daysRemaining} days on ${user.connectionExpiryDate.toDateString()} 11:59pm. Please top up Ksh ${user.package.price - user.balance} to till number ${process.env.TillNumber}.Thank you.`;

            // Avoid duplicate notifications
            if (!user.lastReminderSent || new Date(user.lastReminderSent).toDateString() !== now.toDateString()) {
              // Send Email
              if (user.email){
                await sendEmailNotification(user.email, subject, message);
              }else{
                console.log(`${user.username} has no email, skipping email notification.`);
              }
  
              // Send SMS
              // await sendSMSNotification(user, message);
  
              // Update lastReminderSent
              user.lastReminderSent = now;
              await user.save();
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending notifications:", error.message);
    }
  };
  
  // Schedule job to run daily at 8 AM
  const notificationJob = cron.schedule('0 8 * * *', async () => {
    try {
        console.log('Running notification job...');
        await notifyUsers();
        console.log('Notification job completed');
    } catch (error) {
        console.error('Error in notification job:', error);
    }
}, {
    scheduled: true,
    timezone: 'Africa/Nairobi'
});

  module.exports = { notificationJob }