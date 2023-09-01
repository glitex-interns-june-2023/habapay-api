const CustomError = require("./CustomError");
class BusinessNotFoundError extends CustomError {
  constructor(userId) {
    super(`No business found for userId: ${userId}`, 404);
  }
}

module.exports = BusinessNotFoundError;
