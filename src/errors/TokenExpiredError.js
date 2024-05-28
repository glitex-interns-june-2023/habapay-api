const CustomError = require("./CustomError");

class TokenExpiredError extends CustomError{
    constructor(message = "Token expired: The token provided has expired."){
        super(message, 401);
    }
}

module.exports = TokenExpiredError;