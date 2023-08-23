const authService = require("../services/auth");
const userService = require("../services/user");

const {
  createAccessToken,
  createRefreshToken,
} = require("../middlewares/authMiddleware");

const handleGoogleAuth = async (req, res, next) => {
  const { token } = req.body;

  if (!token)
    return res.status(400).json({
      success: false,
      message: "Google token is required",
      error: {
        code: "ERR_MISSING_FIELDS",
        details: [
          {
            field: "token",
            message: "Google token is required",
          },
        ],
      },
    });

  const payload = await authService.verifyGoogleToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Invalid google token",
    });
  }

  const existingUser = await userService.findByGoogleId(payload.sub);

  if (!existingUser) {
    const email = payload.email;
    const firstName = payload.given_name;
    const lastName = payload.family_name;
    const username = payload.name;
    const profileUrl = payload.picture;

    try {
      const foundUser = await userService.findByEmail(email);

      if (foundUser)
        return res.status(409).json({
          success: false,
          message: "User already exists",
        });

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
        message: "User registered successfully",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Unable to create user",
      });
    }
  }

  // user exists
  const accessToken = createAccessToken(existingUser);
  const refreshToken = createRefreshToken(existingUser);

  const user = {
    ...userData,
    accessToken,
    refreshToken,
  };

  req.user = user;

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: user,
  });
};

module.exports = {
  handleGoogleAuth,
};
