const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String, 
        required: true,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: "+value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error(value+" is not a Strong Password")
            }
        }
    },
    skills: [String],
    about: {
        type: String,
        default: "This is default about us"
    },
    photoURL: {
        type: String,
        default: "https://beyondbricks.in/assets/img/dummy-user.png",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL : "+value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    }
},{ timestamps: true });

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;