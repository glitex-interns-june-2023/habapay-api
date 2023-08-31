/**
 * Format incoming requests to receive snake_case params and request body
 * Send snake_cased json response
 * Snake cased incoming requests are converted to camelCase(Javascript standard)
 */
const { snakeCase, camelCase } = require("../utils");

const snakeCaseFormatter = (req, res, next) => {
  const originalJson = res.json;
  req.body = convertToCamelCase(req.body);
  req.query = convertToCamelCase(req.query);

  res.json = function (data) {
    const formattedData = convertToSnakeCase(data);
    originalJson.call(this, formattedData);
  };

  next();
};

function convertToSnakeCase(data) {
  if (Array.isArray(data)) {
    return data.map(convertToSnakeCase);
  } else if (data !== null && typeof data === "object") {
    return Object.keys(data).reduce((result, key) => {
      const value = data[key];
      const formattedKey = snakeCase(key);

      let formattedValue;
      if (value instanceof Date) {
        formattedValue = value.toISOString();
      } else {
        formattedValue = convertToSnakeCase(value);
      }

      result[formattedKey] = formattedValue;

      return result;
    }, {});
  } else {
    return data;
  }
}

function convertToCamelCase(data) {
  if (Array.isArray(data)) {
    return data.map(convertToCamelCase);
  } else if (data !== null && typeof data === "object") {
    return Object.keys(data).reduce((result, key) => {
      const value = data[key];
      const formattedKey = camelCase(key);
      const formattedValue = convertToCamelCase(value);

      result[formattedKey] = formattedValue;

      return result;
    }, {});
  } else {
    return data;
  }
}

module.exports = { snakeCaseFormatter };
