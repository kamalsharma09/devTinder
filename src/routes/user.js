const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"


//get all pending requests for logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const data = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "intrested",
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({ message: "Data fatched successfully", data });

    } catch(err) {
        res.status(400).send("ERROR: "+err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser, status: "accepted"},
                {fromUserId: loggedInUser, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data});


    } catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try{
        const loggedinUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedinUser._id},
                {toUserId: loggedinUser._id}
            ]
        });

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req)=> {
            hideUserFromFeed.add(req.toUserId.toString());
            hideUserFromFeed.add(req.fromUserId.toString());
        });

        const users = await User.find({
            _id: {$nin: Array.from(hideUserFromFeed)}
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send(users);
    } catch(err) {
        res.status(400).send("ERROR: "+err.message);
    }
});

module.exports = userRouter;