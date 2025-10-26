const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest =  require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

//send connection request API
requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try{

        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUserId = req.params.userId;

        
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({ message: "Invalid User Id" })
        }

        const allowedStatus = ["ignored", "intrested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status" })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if(existingConnectionRequest) {
            return res.status(400).json({ message: "Connection Request already exist" });
        }
        
        const connectionRequest = await ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();


        res.json({
            message: req.user.firstName+" "+status+" "+toUser.firstName+"`s profile",
            data: data
        });
    } catch(err) {
        res.status(400).send("ERROR: "+err.message);
    }
});

module.exports = requestRouter;