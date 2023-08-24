const CustomError = require("./CustomError");

class ServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

module.exports = ServerError;