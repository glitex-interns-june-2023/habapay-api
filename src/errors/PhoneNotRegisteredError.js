const CustomError = require("./CustomError");

class PhoneNotRegisteredError extends CustomError{
    constructor(phone){
        super(`Error: No user with the phone: ${phone} was found.`, 400);
    }
}

module.exports = PhoneNotRegisteredError;