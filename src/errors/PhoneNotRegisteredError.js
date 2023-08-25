const CustomError = require("./CustomError");

class PhoneNotRegisteredError extends CustomError{
    constructor(phone){
        super(`Error: No user with the phone: ${phone} was found.`, 404);
    }
}

module.exports = PhoneNotRegisteredError;