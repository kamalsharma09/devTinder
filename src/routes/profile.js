const express = require("express");
const { userAuth } = require("../middleware/auth");
const {validateEditProfileData} =require("../utils/validation")

const profileRouter = express.Router();

// profile view api
profileRouter.get("/profile/view", userAuth,  async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch(err) {
        res.status(400).send("Error saving the user : "+err.message);
    }
});

// profile edit api
profileRouter.patch("/profile/edit", userAuth,  async (req, res) => {
    try {
        const user = req.body;
        if(!validateEditProfileData(user)) {
            throw new Error("Edit not allowed !!");
        }
        const loggedInUser = req.user;
        Object.keys(user).forEach((key) => (loggedInUser[key] = user[key]));
        await loggedInUser.save();

        res.json({
            message: "User updated successfully",
            data: loggedInUser
        });
        
    } catch(err) {
        res.status(400).send("Error saving the user : "+err.message);
    }
});

module.exports = profileRouter;