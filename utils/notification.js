const nodemailer = require('nodemailer');

const sendNotification = async (email, message) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Subscription Expiry Reminder",
            text: message,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} successfully`);
    }catch(error){
        console.error("Error sending email:", error.message);
    }
}

module.exports = sendNotification;