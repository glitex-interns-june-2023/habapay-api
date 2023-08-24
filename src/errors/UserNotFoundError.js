const CustomError = require("./CustomError");

class UserNotFoundError extends CustomError{
    constructor(message){
        super(message = "User not found", 404);
    }

}

module.exports = UserNotFoundError;