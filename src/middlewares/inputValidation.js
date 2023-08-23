const { validationResult } = require("express-validator");
const validateInput = (req, res, next) => {
  // check if there are validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: {
        code: "ERR_VALIDATION_ERROR",
        details: errorDetails,
      },
    });
  }

  // if validation pases, continue to next middleware or router handler
  next();
};

const validateQueryParams = (req, res, next) => {
  // check if there are validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      param: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: {
        code: "ERR_VALIDATION_ERROR",
        details: errorDetails,
      },
    });
  }

  next();
};

const validateRouteParams = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      param: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: {
        code: "ERR_VALIDATION_ERROR",
        details: errorDetails,
      },
    });
  }

  next();
};

module.exports = {
  validateInput,
  validateQueryParams,
  validateRouteParams,
};
