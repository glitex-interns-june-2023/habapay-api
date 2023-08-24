const CustomError = require("./CustomError");

class ValidationError extends CustomError{
    constructor(message= "Unprocessable entity"){
        super(message, 422);
    }
}

module.exports = ValidationError;