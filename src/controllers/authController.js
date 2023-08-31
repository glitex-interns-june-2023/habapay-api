const authService = require("../services/auth");
const userService = require("../services/user");
const messageService = require("../services/messaging");
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
  const { email, firstName, lastName, username, phone, password } = req.body;

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

    const savedUser = await userService.saveUser({
      email,
      firstName,
      lastName,
      username,
      phone,
      password,
    });

    const accessToken = createAccessToken(savedUser);
    const refreshToken = createRefreshToken(savedUser);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: {
        ...savedUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const sendOTP = async (req, res, next) => {
  const { phoneNumber, email } = req.body;
  try {
    const foundUser = await userService.findByEmail(email);
    if (!foundUser) {
      let error = new Error("No user with this email was found");
      error.statusCode = 404;
      throw error;
    }

    await messageService.sendOTP(phoneNumber);

    await userService.updatePhoneNumber(foundUser.id, phoneNumber);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  const { phoneNumber, otp } = req.body;
  try {
    const foundUser = await userService.findByPhone(phoneNumber);

    if (!foundUser) {
      let error = new Error("No user with this phone number was found");
      error.statusCode = 404;
      throw error;
    }

    await messageService.verifyOTP(phoneNumber, otp);

    await userService.setVerified(foundUser.id);

    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
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

module.exports = {
  login,
  register,
  sendOTP,
  verifyOTP,
  pinLogin,
  updateLoginPin,
};
