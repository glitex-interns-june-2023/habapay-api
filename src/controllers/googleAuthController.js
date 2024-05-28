const authService = require("../services/authService");
const userService = require("../services/userService");

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

      const user = await userService.saveUser({
        googleId: payload.sub,
        email,
        firstName,
        lastName,
        username,
        profileUrl,
      });

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      let data = {
        ...user,
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
    // user exists
    const accessToken = createAccessToken(existingUser);
    const refreshToken = createRefreshToken(existingUser);

    const user = {
      ...existingUser,
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
    next(error);
  }
};

module.exports = {
  handleGoogleAuth,
};
