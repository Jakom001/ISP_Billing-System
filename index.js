const express = require("express");
const userRoutes = require("./routes/usersRoutes");
const packageRoutes = require("./routes/packageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Connect Database
const connectDB = require("./config/db");
const app = express()

app.use(express.json())

// Connect Database
connectDB();


app.get("/", (req, res) =>{
    res.send("home")
})
app.use("/api/users", userRoutes)
app.use("/api/packages", packageRoutes)
app.use("/api/payments", paymentRoutes)

app.use((req, res) =>{
    res.status(404).send("page not found")
})

app.listen(4000, () =>{
    console.log("Server running in port 4000")
})
