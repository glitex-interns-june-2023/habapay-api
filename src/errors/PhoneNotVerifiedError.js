const CustomError = require("./CustomError");

class PhoneNotVerifiedError extends CustomError{
    constructor(phone){
        super(`Error: Phone ${phone} is not verified yet`, 400)
    }
}

module.exports = PhoneNotVerifiedError;