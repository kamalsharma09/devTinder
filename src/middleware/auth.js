const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token) {
            return res.status(401).json({message: "Please login again !!"});
        }
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