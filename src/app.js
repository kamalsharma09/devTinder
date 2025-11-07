const express = require("express");
const cookieParser = require('cookie-parser');
const connectDb = require("./config/database");
const cors = require('cors');
const app = express();
const router = express.Router();
const http = require("http");
require('dotenv').config();

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
const chatRouter = require("./routes/chat")
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const httpServer = http.createServer(app);
initializeSocket(httpServer);

connectDb().then(() => {
    console.log("Database is connected");
    httpServer.listen(process.env.POST,() => {
        console.log("SERVER STARTED");
    });
    
}).catch((err) => {
    console.log("database is not connected", err);
})


