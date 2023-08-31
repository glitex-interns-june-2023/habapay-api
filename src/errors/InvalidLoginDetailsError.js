const CustomError = require("./CustomError");

class InvalidLoginDetailsError extends CustomError {
  constructor(message = "Invalid Login details. Please check and try again.") {
    super(message, 401);
  }
}

module.exports = InvalidLoginDetailsError;
