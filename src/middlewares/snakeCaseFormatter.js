const snakeCaseFormatter = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    const formattedData = convertToSnakeCase(data);
    originalJson.call(this, formattedData);
  };

  next();
};

function convertToSnakeCase(data) {
  if (Array.isArray(data)) {
    return data.map(convertToSnakeCase);
  } else if (data !== null && data.constructor === Object) {
    return Object.keys(data).reduce((result, key) => {
      const value = data[key];
      const formattedKey = snakeCase(key);
      const formattedValue = convertToSnakeCase(value);

      result[formattedKey] = formattedValue;

      return result;
    }, {});
  } else {
    return data;
  }
}

function snakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

module.exports = {snakeCaseFormatter};
