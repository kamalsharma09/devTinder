const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

//send connection request API
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try{

        res.send(req.user.firstName+" is sending request");
    } catch(err) {
        res.status(400).send("ERROR: "+err.message);
    }
});

module.exports = requestRouter;