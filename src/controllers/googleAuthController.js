const authService = require("../services/auth");
const userService = require("../services/user");

const {
  createAccessToken,
  createRefreshToken,
} = require("../middlewares/authMiddleware");

const handleGoogleAuth = async (req, res, next) => {
  const { token } = req.body;

  try {
    const payload = await authService.verifyGoogleToken(token);
    const existingUser = await userService.findByGoogleId(payload.sub);

    if (!existingUser) {
      const email = payload.email;
      const firstName = payload.given_name;
      const lastName = payload.family_name;
      const username = payload.name;
      const profileUrl = payload.picture;

      await userService.findByEmail(email);

      let data = {
        email,
        firstName,
        lastName,
        username,
        profileUrl,
      };

      const newUser = await userService.saveUser(data);
      const userData = newUser.get({ raw: true });

      const accessToken = createAccessToken(userData);
      const refreshToken = createRefreshToken(userData);

      data = {
        ...userData,
        accessToken,
        refreshToken,
      };

      req.user = data;

      return res.status(200).json({
        success: true,
        message: "Registration successful",
        data,
      });
    }

    const userData = existingUser.get({ raw: true });
    // user exists
    const accessToken = createAccessToken(userData);
    const refreshToken = createRefreshToken(userData);

    const user = {
      ...userData,
      accessToken,
      refreshToken,
    };

    req.user = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleGoogleAuth,
};
