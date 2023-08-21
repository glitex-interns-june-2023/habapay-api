const authService = require("../services/auth");
const userService = require("../services/user");

const {
  createAccessToken,
  createRefreshToken,
} = require("../middlewares/authMiddleware");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const checkEmail = await userService.findByEmail(email);

  if (!checkEmail) {
    return res.status(400).json({
      success: false,
      message: "No user with such email was found",
    });
  }

  const user = await authService.checkLogin(email, password);
  const { password: passwordToRemove, ...userData } = user.get({ raw: true });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid login details. Please try again",
      error: {
        code: "ERR_INVALID_LOGIN",
      },
    });
  }

  const accessToken = createAccessToken(userData);
  const refreshToken = createRefreshToken(userData);

  return res.status(200).json({
    success: true,
    messsage: "Login successful",
    data: {
      ...userData,
      accessToken,
      refreshToken,
    },
  });
};

const register = async (req, res, next) => {
  const { email, firstName, lastName, username, phone, password } = req.body;

  let existingUser = await userService.findByEmail(email);

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "A user with a simmilar email is already registered",
    });
  }

  existingUser = await userService.findByPhone(phone);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "This phone has alredy been registered",
    });
  }

  const savedUser = await userService.saveUser({
    email,
    firstName,
    lastName,
    username,
    phone,
    password,
  });

  if (!savedUser) {
    return res.status(500).json({
      success: false,
      message: "Unable to register user. Please try again",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User registered successfully",
    data: {
      ...savedUser,
    },
  });
};

module.exports = {
  login,
  register,
};
