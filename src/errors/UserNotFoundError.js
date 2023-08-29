const CustomError = require("./CustomError");

class UserNotFoundError extends CustomError {
  constructor(message = "User not found") {
    super(message, 404);
  }
}

module.exports = UserNotFoundError;
