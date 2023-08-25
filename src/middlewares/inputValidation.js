const { validationResult } = require("express-validator");
const { snakeCase } = require("../utils");

const validateInputs = (req, res, next) => {
  // check if there are validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      field: snakeCase(error.path),
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
      param: snakeCase(error.param),
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
      param: snakeCase(error.param),
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


const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0];

    return res.status(400).json({
      success: false,
      message: error.msg,
      field: snakeCase(error.path)
    });
  }

  next();
};
const validateRouteParam = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0];

    return res.status(400).json({
      success: false,
      message: error.msg,
      param: snakeCase(error.path),
    });
  }

  return next();
};

const validateQueryParam = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: error.msg,
      param: snakeCase(error.path)
    });
  }

  return next();
};

module.exports = {
  validateInputs,
  validateInput,
  validateQueryParams,
  validateQueryParam,
  validateRouteParams,
  validateRouteParam,
};
