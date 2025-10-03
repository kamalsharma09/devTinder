const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("test");
});

app.use('/signup', (req, res) => {
    res.send("Welcome to Signup Page");
});

app.use("/",(req, res) => {
    res.send("Welcome to Homepage !!");
});


app.listen(7777,() => {
    console.log("SERVER STARTED")
});