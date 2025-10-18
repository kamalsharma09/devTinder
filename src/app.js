const express = require("express");
const { userAuth } = require("./middleware/auth");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const User = require("./models/user");
const connectDb = require("./config/database");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

    //creating a new instance of the model
    // const userJson = {
    //     firstName: "Kamal",
    //     lastName: "Sharma",
    //     email: "kamalsharmag123@gmail.com",
    //     password: "pasword",
    //     age: 27,
    //     gender: "Male"
    // }

    
    try{
        validateSignupData(req.body);
        const {firstName, lastName, emailId, password} = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword
        });
        
        await user.save();
        res.send("User Added Successfully !!");
    } catch(err) {
        res.status(400).send("Error saving the user : "+err.message);
    }
    
})

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credential");
        }

        const isPasswordIsCorrect = await user.validatePassword(password);
        
        if(isPasswordIsCorrect) {
            // generate cookies
            const token = await user.getJWT();

            // set cookies
            res.cookie("token", token,{
                expires: new Date(Date.now() + 84 * 3600000) // cookie will be removed after 7 days
            })

            res.status(200).send("Login Successfully");
        } else {
            throw new Error("Invalid credential 2");
        }
        
      
    } catch(err) {
        res.status(400).send("Error saving the user : "+err.message);
    }
    
});


// profile api
app.get("/profile", userAuth,  async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch(err) {
        res.status(400).send("Error saving the user : "+err.message);
    }
});

//send connection request API

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try{

        res.send(req.user.firstName+" is sending request");
    } catch(err) {
        res.status(400).send("ERROR: "+err.message);
    }
});



// get user by emailID
app.get("/user", async (req, res) => {
    const emailId = req.body.email;
    try {
        const user = await User.find({emailId: emailId});
        if(user.length === 0) {
            res.status(404).send("User not found");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong !!");
    }
    
});

// get all user
app.get("/feed", async (req, res) => {
    try {
        const user = await User.find();
        if(user.length === 0) {
            res.status(404).send("User not found");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong !!");
    }
    
});

// update user by id
app.patch("/user/:userId", async (req, res) => {
    const userId =req.params.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATE = [
            "firstName",
            "lastName",
            "password",
            "skills",
            "age",
            "gender"
        ];

        const isAllowedUpdate = Object.keys(data).every((k) => 
            ALLOWED_UPDATE.includes(k)
        )

        if(!isAllowedUpdate) {
            throw new Error("Update not allowed");
        }

        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true
        });
        res.send(user);
    }
    catch(err) {
        res.status(400).send("UPDATE FAILED: "+err.message);
    }
})

// delete user by id
app.delete("/user", async (req, res) => {
    const userId =req.body.userId;
    try {
        const user = await User.findOneAndDelete(userId);
        res.send(user);
    }
    catch(err) {
        res.status(400).send("something went wrong !!");
    }
})


connectDb().then(() => {
    console.log("Database is connected");
    app.listen(7777,() => {
        console.log("SERVER STARTED");
    });
    
}).catch((err) => {
    console.log("database is not connected", err);
})


