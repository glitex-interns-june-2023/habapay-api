const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(
    {
      user,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      user,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};



module.exports = {
    createAccessToken,
    createRefreshToken,
};