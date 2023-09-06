const authService = require("../services/auth");
const userService = require("../services/user");
const ConflictError = require("../errors/ConflictError");

const {
  createAccessToken,
  createRefreshToken,
} = require("../middlewares/authMiddleware");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await userService.findByEmail(email);

    const user = await authService.checkLogin(email, password);

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
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const {
    username,
    phone,
    email,
    password,
    secondaryPhone,
    businessName,
    location,
    loginPin,
  } = req.body;

  try {
    let existingUser = await userService.findByEmail(email);

    if (existingUser) {
      throw new ConflictError(
        "A user with a simmilar email is already registered"
      );
    }

    existingUser = await userService.findByPhone(phone);

    if (existingUser) {
      throw new ConflictError("This phone has alredy been registered");
    }

    const savedAdmin = await userService.createAdmin({
      username,
      phone,
      email,
      password,
      secondaryPhone,
      businessName,
      location,
      loginPin,
    });

    const accessToken = createAccessToken(savedAdmin);
    const refreshToken = createRefreshToken(savedAdmin);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        ...savedAdmin,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const pinLogin = async (req, res, next) => {
  const { email, pin } = req.body;
  try {
    const user = await authService.pinLogin(email, pin);

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const response = {
      ...user,
      accessToken,
      refreshToken,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const updateLoginPin = async (req, res, next) => {
  const { email, pin } = req.body;
  try {
    await authService.createOrUpdateLoginPin(email, pin);

    return res.status(200).json({
      success: true,
      message: "Login PIN updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const createTestUserAccount = async (req, res, next) => {
  const {username, email, phone, password } = req.body;

  const user = await userService.saveUser({
    username,
    email,
    phone,
    password
  });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  let data = {
    ...user,
    accessToken,
    refreshToken,
  };

  return res.status(201).json({
    sucess: true,
    message: "Account created successfully",
    data: data,
  });
};

const updatePassword = async (req, res, next) => {
  const { email, password, token } = req.body;
  try {
    await authService.updatePassword(email, password, token);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    await authService.sendResetPasswordLink(email);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent successfully. Please check your email",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register,
  pinLogin,
  updateLoginPin,
  createTestUserAccount,
  updatePassword,
  resetPassword,
};
