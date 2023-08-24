const CustomError = require("./CustomError");

class BadRequestError extends CustomError{
    constructor(message = "Bad request: Invalid data"){
        super(message, 400);
    }
}

module.exports = BadRequestError;