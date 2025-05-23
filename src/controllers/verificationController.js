const UserNotFoundError = require("../errors/UserNotFoundError");
const messageService = require("../services/messagingService");
const userService = require("../services/userService");
const authService = require("../services/authService");
const verificationService = require("../services/verificationService");

const sendOTP = async (req, res, next) => {
  const { phoneNumber, email } = req.body;
  try {
    const foundUser = await userService.findByEmail(email);
    if (!foundUser) {
      let error = new Error("No user with this email was found");
      error.statusCode = 404;
      throw error;
    }

    const otp =  await messageService.sendOTP(phoneNumber);
    await verificationService.saveOtp(foundUser, otp);
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
    const user = await userService.findByPhone(phoneNumber);
    
    if(!user){
      throw UserNotFoundError("No user with the given phone number was found")
    }
    await verificationService.verifyOTP(user.id, otp);

    await userService.setPhoneVerified(user.id);

    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const sendPin = async (req, res, next) => {
  const { email } = req.body;
  try {
    const foundUser = await userService.findByEmail(email);

    if (!foundUser) {
      throw new UserNotFoundError("No user with this email was found");
    }

    const pin = authService.generateUniquePin();

    await messageService.sendPin(email, pin);

    await verificationService.savePin(foundUser.id, pin);

    res.status(200).json({
      success: true,
      message:
        `A verification PIN has been sent to ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

const verifyPin = async (req, res, next) => {
  const { email, pin } = req.body;
  try {
    const foundUser = await userService.findByEmail(email);

    if (!foundUser) {
      throw new UserNotFoundError("No user with this email was found");
    }

    await verificationService.verifyPin(foundUser.id, pin);

    await userService.setEmailVerified(foundUser.id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const sendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const foundUser = await userService.findByEmail(email);
    if (!foundUser) {
      throw new UserNotFoundError("No user with this email was found");
    }

    const verificationToken = authService.generateUniqueToken();

    await messageService.sendVerificationEmail(email, verificationToken);

    await verificationService.saveEmailVerificationToken(
      foundUser.id,
      verificationToken
    );

    res.status(200).json({
      success: true,
      message:
        "A verification email has been sent to your email account that you entered.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify token passed as a link e.g. verify?token=tokenstring
 */
const verifyEmailVerificationToken = async (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send("Error. Missing verification token");
  }

  try {
    const user = await verificationService.verifyEmailVerificationToken(token);

    await userService.setEmailVerified(user.id);

    res.status(200).send("Email verified successfully!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  sendPin,
  verifyPin,
  sendVerificationEmail,
  verifyEmailVerificationToken,
};
