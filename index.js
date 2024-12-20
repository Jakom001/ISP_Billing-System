const express = require("express");
const userRoutes = require("./routes/usersRoutes");
const connectDB = require("./config/db");
const app = express()

app.use(express.json())

// Connect Database
connectDB();


app.get("/", (req, res) =>{
    res.send("home")
})
app.use("/api", userRoutes)
app.use((req, res) =>{
    res.status(404).send("page not found")
})

app.listen(4000, () =>{
    console.log("Server running in port 4000")
})
