const CustomError = require("./CustomError");

class InvalidGoogleTokenError extends CustomError {
  constructor(message = "Invalid google token") {
    super(message, 401);
  }
}

module.exports = InvalidGoogleTokenError;