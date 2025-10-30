const express = require("express");
const cookieParser = require('cookie-parser');
const connectDb = require("./config/database");
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(cors({
  origin: "http://localhost:5173",  // your frontend origin
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


// // get user by emailID
// app.get("/user", async (req, res) => {
//     const emailId = req.body.email;
//     try {
//         const user = await User.find({emailId: emailId});
//         if(user.length === 0) {
//             res.status(404).send("User not found");
//         }
//         res.send(user);
//     } catch (err) {
//         res.status(400).send("Something went wrong !!");
//     }
    
// });

// // get all user
// app.get("/feed", async (req, res) => {
//     try {
//         const user = await User.find();
//         if(user.length === 0) {
//             res.status(404).send("User not found");
//         }
//         res.send(user);
//     } catch (err) {
//         res.status(400).send("Something went wrong !!");
//     }
    
// });

// // update user by id
// app.patch("/user/:userId", async (req, res) => {
//     const userId =req.params.userId;
//     const data = req.body;
//     try {
//         const ALLOWED_UPDATE = [
//             "firstName",
//             "lastName",
//             "password",
//             "skills",
//             "age",
//             "gender"
//         ];

//         const isAllowedUpdate = Object.keys(data).every((k) => 
//             ALLOWED_UPDATE.includes(k)
//         )

//         if(!isAllowedUpdate) {
//             throw new Error("Update not allowed");
//         }

//         const user = await User.findByIdAndUpdate({_id: userId}, data, {
//             returnDocument: "after",
//             runValidators: true
//         });
//         res.send(user);
//     }
//     catch(err) {
//         res.status(400).send("UPDATE FAILED: "+err.message);
//     }
// })

// // delete user by id
// app.delete("/user", async (req, res) => {
//     const userId =req.body.userId;
//     try {
//         const user = await User.findOneAndDelete(userId);
//         res.send(user);
//     }
//     catch(err) {
//         res.status(400).send("something went wrong !!");
//     }
// })


connectDb().then(() => {
    console.log("Database is connected");
    app.listen(7777,() => {
        console.log("SERVER STARTED");
    });
    
}).catch((err) => {
    console.log("database is not connected", err);
})


