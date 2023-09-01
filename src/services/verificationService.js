const ValidationError = require("../errors/ValidationError");
const { User, Verification } = require("../models");

const verifyPin = async (userId, pin) => {
  const verification = await Verification.findOne({
    where: {
      userId,
      type: "pin",
      token: pin,
    },
  });

  if (!verification) {
    throw new ValidationError("Invalid pin");
  }

  const isExpired = new Date() > verification.expiryTime;

  if (isExpired) {
    // delete pin
    await verification.destroy();

    throw new ValidationError("Pin has expired");
  }

  // delete verification pin
  await verification.destroy();

  return true;
};

const verifyEmailVerificationToken = async (token) => {
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
    throw new ValidationError("Invalid Verification token");
  }

  const isExpired = new Date() > verification.expiryTime;
  if (isExpired) {
    await verification.destroy();

    throw new ValidationError("Token has expired");
  }

  await verification.destroy();

  return verification.user;
};

module.exports = {
  verifyPin,
  verifyEmailVerificationToken,
};
