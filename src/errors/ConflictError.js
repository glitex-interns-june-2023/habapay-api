const CustomError = require("./CustomError");

class ConflictError extends CustomError{
    constructor(message = "Conflict: A conflict occurred with existing data."){
        super(message, 409);
    }
}

module.exports = ConflictError;