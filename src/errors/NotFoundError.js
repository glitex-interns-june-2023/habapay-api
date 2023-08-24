const CustomError = require("./CustomError");

class NotFoundError extends CustomError{
    constructor(resource = "Resource"){
        super(message=`Not found: The requested resource: ${resource} was not found`, 404);
    }
}

module.exports = NotFoundError;