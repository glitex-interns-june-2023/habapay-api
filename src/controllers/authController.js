const authService = require("../services/auth");
const {
  createAccessToken,
  createRefreshToken,
} = require("../middlewares/authMiddleware");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authService.checkLogin(email, password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid login details. Please try again",
      error: {
        code: "ERR_INVALID_LOGIN",
      },
    });
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return res.status(200).json({
    success: true,
    messsage: "Login successful",
    data: {
      ...user,
      accessToken,
      refreshToken,
    },
  });

};

const register = (req, res, next) => {};

module.exports = {
  login,
  register,
};
