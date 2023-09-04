const errorHandler = (err, req, res, next) => {
  console.log("error: ", err)
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandler;
