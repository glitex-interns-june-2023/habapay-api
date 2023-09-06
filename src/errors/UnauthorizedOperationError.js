const CustomError = require("./CustomError");

class UnauthorizedOperationError extends CustomError {
  constructor(operation = "") {
    super((`Unauthorized operation: ${operation}`), 401);
  }
}

module.exports = UnauthorizedOperationError;
