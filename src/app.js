const express = require("express");
const { adminAuth } = require("./middleware/auth")
const app = express();

app.get("/admin",adminAuth, (req, res) => {
    res.send("test");
});

app.get("/admin/test",adminAuth, (req, res) => {
    res.send("test");
});

// app.use('/signup', (req, res) => {
//     res.send("Welcome to Signup Page");
// });

// app.use("/",(req, res) => {
//     res.send("Welcome to Homepage !!");
// });


app.listen(7777,() => {
    console.log("SERVER STARTED")
});