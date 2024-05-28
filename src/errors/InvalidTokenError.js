const CustomError = require("./CustomError");

class InvalidTokenError extends CustomError{
    constructor(message = "Invalid token. Please try again"){
        super(message, 401);
    }
}

module.exports = InvalidTokenError;