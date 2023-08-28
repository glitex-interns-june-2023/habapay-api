const CustomError = require("./CustomError");

class ResourceNotFoundError extends CustomError{
    constructor(resource = "Resource"){
        super(`Not found: The requested resource: ${resource} was not found`, 404);
    }
}

module.exports = ResourceNotFoundError;