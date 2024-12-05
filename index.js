const express = require("express");
const mongoose = require("mongoose");

const app = express()

mongoose.connect("mongodb://localhost:27017/isp")
.then((result) => app.listen(4000))
.catch((err) => console.log(err));

app.get("/", (req, res) =>{
    res.send("hello there")
})
app.use((req, res) =>{
    res.status(404).send("page not found")
})
