const { TokenExpiredError } = require("jsonwebtoken");
const InvalidLoginDetailsError = require("../errors/InvalidLoginDetailsError");
const InvalidTokenError = require("../errors/InvalidTokenError");
const { User, Verification } = require("../models");
const userService = require("./userService");

const verifyPin = async (userId, pin) => {
  const verification = await Verification.findOne({
    where: {
      userId,
      type: "pin",
      token: pin,
    },
  });

  if (!verification) {
    throw new InvalidLoginDetailsError("Invalid pin");
  }

  const isExpired = new Date() > verification.expiryTime;

  if (isExpired) {
    // delete pin
    await verification.destroy();

    throw new InvalidLoginDetailsError("Pin has expired");
  }

  // delete verification pin
  await verification.destroy();

  return true;
};

const verifyEmailVerificationToken = async (token) => {
  console.log(token);
  const verification = await Verification.findOne({
    where: {
      token,
      type: "email",
    },
    include: {
      model: User,
      as: "user",
    },
  });

  if (!verification) {
    throw new InvalidLoginDetailsError("Invalid Verification token");
  }

  const isExpired = new Date() > verification.expiryTime;
  if (isExpired) {
    await verification.destroy();

    throw new InvalidLoginDetailsError("Token has expired");
  }

  await verification.destroy();

  return verification.user;
};

const savePin = async (userId, pin) => {
  const minutes = 5;
  const now = new Date();
  const expiryTime = new Date(now.getTime() + minutes * 60 * 1000);

  const verification = await Verification.create({
    userId,
    token: pin,
    type: "pin",
    expiryTime,
  });

  return verification;
};

const saveOtp = async (phoneNumber, otp) => {
  const { id } = await userService.findByPhone(phoneNumber);

  const minutes = 5;
  const now = new Date();
  const expiryTime = new Date(now.getTime() + minutes * 60 * 1000);

  const verification = await Verification.create({
    userId: id,
    token: otp,
    type: "otp",
    expiryTime,
  });

  return verification;
};

const verifyOTP = async (userId, otp) => {
  const verification = await Verification.findOne({
    where: {
      userId,
      type: "otp",
      token: otp,
    },
  });

  // check if token is valid
  if (!verification) {
    throw new InvalidTokenError("Invalid OTP. Please check and try again");
  }

  // check if token has expired
  const isExpired = new Date() > verification.expiryTime;

  if (isExpired) {
    await verification.destroy();
    throw new TokenExpiredError();
  }

  // destroy all otps for user
  await Verification.destroy({
    where: {
      userId,
      type: "otp",
    },
  });

  return true;
};

const saveEmailVerificationToken = async (userId, token) => {
  const minutes = 5;
  const now = new Date();
  const expiryTime = new Date(now.getTime() + minutes * 60 * 1000);

  const verification = await Verification.create({
    userId,
    token,
    type: "email",
    expiryTime,
  });

  return verification;
};

module.exports = {
  verifyPin,
  verifyEmailVerificationToken,
  savePin,
  saveOtp,
  verifyOTP,
  saveEmailVerificationToken,
};
