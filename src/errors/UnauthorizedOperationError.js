const CustomError = require("./CustomError");

class UnauthorizedOperationError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

module.exports = UnauthorizedOperationError;