const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try{
        const cookies = req.cookies;
        if(!cookies) {
            throw new Error("Please login again !!");
        }
        const { token } = cookies;
        const decodedObj = jwt.verify(token, "DEV@Tinder123");
        const user = await User.findById(decodedObj._id);
        if(!user) {
            throw new Error("User not found")
        }
        req.user = user;
        next()
    } catch(err) {
        res.status(400).send("ERROR: "+err);
    }
}

module.exports = {
    userAuth
}