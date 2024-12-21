const express = require("express");
const userRoutes = require("./routes/usersRoutes");
const packageRoutes = require("./routes/packageRoutes");
const packageRoutes = require("./routes/packageRoutes");

// Connect Database
const connectDB = require("./config/db");
const app = express()

app.use(express.json())

// Connect Database
connectDB();


app.get("/", (req, res) =>{
    res.send("home")
})
app.use("/api", userRoutes, packageRoutes, )


app.use((req, res) =>{
    res.status(404).send("page not found")
})

app.listen(4000, () =>{
    console.log("Server running in port 4000")
})
