const express = require("express");
const { adminAuth } = require("./middleware/auth");
const User = require("./models/user")
const connectDb = require("./config/database")
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {

    //creating a new instance of the model
    const userJson = {
        firstName: "Kamal",
        lastName: "Sharma",
        email: "kamalsharmag123@gmail.com",
        password: "pasword",
        age: 27,
        gender: "Male"
    }

    const user = new User(req.body);
    try{
        await user.save();
        res.send("User Added Successfully !!");
    } catch(err) {
        res.status(400).send("Error saving the user : "+err.message);
    }
    
})


connectDb().then(() => {
    console.log("Database is connected");
    app.listen(7777,() => {
        console.log("SERVER STARTED")
    });
    
}).catch((err) => {
    console.log("database is not connected", err);
})


