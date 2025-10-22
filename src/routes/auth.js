const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {validateSignupData} = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
    try{
        res.cookie("token", null,{
            expires: new Date() 
        })
        res.send("logout successfully !!");
    } catch (err) {
        res.status(400).send("Error saving the user : "+err.message);
    }
        
})

module.exports = authRouter;
