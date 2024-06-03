const CustomError = require("./CustomError");

class StkPushError extends CustomError {
  constructor(message = "Failed to initialize STK Push") {
    super(message, 400);
  }
}

exports.StkPushError = StkPushError;