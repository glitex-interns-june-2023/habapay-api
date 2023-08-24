const authService = require("../services/auth");
const userService = require("../services/user");
const messageService = require("../services/messaging");

const {
  createAccessToken,
  createRefreshToken,
} = require("../middlewares/authMiddleware");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await userService.findByEmail(email);

    const user = await authService.checkLogin(email, password);
    const { password: passwordToRemove, ...userData } = user.get({ raw: true });

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
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const register = async (req, res, next) => {
  const { email, firstName, lastName, username, phone, password } = req.body;
  try {
    let existingUser = await userService.findByEmail(email);

    if (existingUser) {
      let error = new Error(
        "A user with a simmilar email is already registered"
      );
      error.statusCode = 409;
      throw error;
    }

    existingUser = await userService.findByPhone(phone);
    if (existingUser) {
      let error = new Error("This phone has alredy been registered");
      error.statusCode = 409;
      throw error;
    }

    const savedUser = await userService.saveUser({
      email,
      firstName,
      lastName,
      username,
      phone,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: {
        ...savedUser,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
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
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
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
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  sendOTP,
  verifyOTP,
};
