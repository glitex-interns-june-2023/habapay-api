const InvalidLoginDetailsError = require("../errors/InvalidLoginDetailsError");
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
  saveEmailVerificationToken,
};
