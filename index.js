const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const userRoutes = require("./routes/usersRoutes");
const packageRoutes = require("./routes/packageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const isAuthenticated = require('./middlewares/authenticateUser');
const {notificationJob} = require("./utils/notifyUsers");
const { checkBalanceJob } = require('./utils/checkBalance');
const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

// Connect Database
connectDB();

// Routes
app.get("/", (req, res) =>{
    res.send("The server is running...")
})
app.use("/api/users", userRoutes)
app.use("/api/packages", packageRoutes)
app.use("/api/payments",  paymentRoutes)
app.use('/api/auths', authRoutes)

// Error Handling: 404 Handler
app.use((req, res) =>{
    res.status(404).send("page not found")
})

app.listen(4000, () =>{
    console.log("Server running in port 4000")
})

// initialize cron jobs

notificationJob.start();
checkBalanceJob.start();

// handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Stopping cron jobs...');
    notificationJob.stop();
    disconnectionJob.stop();
    process.exit(0);
});