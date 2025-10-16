const validator = require("validator");

const validateSignupData = (req) => {
    if(!req.firstName) {
        throw new Error("Please enter first name");
    } else if (!validator.isStrongPassword(req.password)) {
        throw new Error("Please enter a Strong Password");
    } else if (!validator.isEmail(req.emailId)) {
        throw new Error("Enter a valid email Id");
    }
}

module.exports = {
    validateSignupData
}