const express = require("express");
const userRoutes = require("./routes/usersRoutes");
const packageRoutes = require("./routes/packageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const connectDB = require("./config/db");
const cronJobs = require("./utils/cronjobs");
const cors = require('cors');
const helmet = require('helmet');

require("dotenv").config();

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(express.urlencoded({extended: true}));

// Connect Database
connectDB();

// Routes
app.get("/", (req, res) =>{
    res.send("The server is running...")
})
app.use("/api/users", userRoutes)
app.use("/api/packages", packageRoutes)
app.use("/api/payments", paymentRoutes)

// Error Handling: 404 Handler
app.use((req, res) =>{
    res.status(404).send("page not found")
})

app.listen(4000, () =>{
    console.log("Server running in port 4000")
})


// initialize cron jobs
// cronJobs.initializeCronjobs() 