const CustomError = require("./CustomError");

class InsufficientFundsError extends CustomError{
    constructor(message){
        super(message = "Insufficient funds: You have insufficient funds to complete this transaction", 422);
    }
}

module.exports = InsufficientFundsError;