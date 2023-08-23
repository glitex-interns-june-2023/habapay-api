function snakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function camelCase(str) {
  return str.replace(/_[a-z]/g, (letter) => letter[1].toUpperCase());
}


module.exports = {
    snakeCase,
    camelCase
}