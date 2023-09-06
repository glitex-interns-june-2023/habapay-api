const { OAuth2Client } = require("google-auth-library");
const { User, Verification } = require("../models");
const bcrypt = require("bcrypt");
const axios = require("axios");
const InvalidGoogleTokenError = require("../errors/InvalidGoogleTokenError");
const InvalidLoginDetailsError = require("../errors/InvalidLoginDetailsError");
const UserNotFoundError = require("../errors/UserNotFoundError");
const UnauthorizedOperationError = require("../errors/UnauthorizedOperationError");
const crypto = require("crypto");
const { sendEmail } = require("../services/messaging");

const verifyGoogleToken = async (token) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new InvalidGoogleTokenError(error.message);
  }
};

const checkLogin = async (email, password) => {
  const user = await User.findOne({
    where: {
      email: email,
    },
    attributes: {
      include: ["password"],
    },
    raw: true,
  });

  if (!user) {
    throw new UserNotFoundError("No user with such email was found");
  }

  const { password: savedPassword, ...userData } = user;
  const passwordMatch = comparePassword(password, savedPassword);

  if (!passwordMatch) {
    throw new InvalidLoginDetailsError("Invalid login password");
  }

  return userData;
};

const pinLogin = async (email, pin) => {
  const user = await User.findOne({
    where: {
      email,
    },
    attributes: {
      include: ["loginPin"],
    },
    raw: true,
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  const { loginPin, ...userData } = user;
  if (loginPin == null) {
    throw new InvalidLoginDetailsError(
      "Cannot login. Please set login pin first"
    );
  }

  const pinMatch = comparePassword(pin, loginPin);

  if (!pinMatch) {
    throw new InvalidLoginDetailsError();
  }

  return userData;
};

const createOrUpdateLoginPin = async (email, pin) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  user.loginPin = hashPassword(pin);
  await user.save();
  return true;
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(String(password), salt);
  return hash;
};

const comparePassword = (password, hash) => {
  const match = bcrypt.compareSync(String(password), hash);
  return match;
};

const generateMpesaAccessToken = async () => {
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const token = Buffer.from(
    `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });

  if (!response.data || !response.data.access_token) {
    throw new Error("Could not get access token");
  }

  return response.data.access_token;
};

// generate a random PIN to
const generateUniquePin = () => {
  const randomBytes = crypto.randomBytes(3); // 3 bytes = 24 bits
  const randomNumber = randomBytes.readUIntBE(0, 3); // Read a 3-byte integer

  // Ensure the number is within the range of 100000 to 999999
  const min = 100000;
  const max = 999999;
  const sixDigitPIN = min + (randomNumber % (max - min + 1));

  return sixDigitPIN.toString();
};

// generate a unique email verification token
const generateUniqueToken = () => {
  const randomBytes = crypto.randomBytes(32);
  const token = randomBytes.toString("hex");
  return token;
};

const updatePassword = async (email, password, token) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  // check password verification token, and if expired
  const verification = await Verification.findOne({
    where: {
      userId: user.id,
      type: "password",
    },
  });

  if(!verification){
    throw new UnauthorizedOperationError("Reset Password. No reset password request found")
  }
  if(verification.token != token){
    throw new UnauthorizedOperationError("Reset Password. Invalid reset password token")
  }

  const isExpired = new Date() > verification.expiryTime;
  if(isExpired){
    throw new UnauthorizedOperationError("Reset Password. Reset password token has expired")
  }

  user.password = hashPassword(password);
  await user.save();
  return true;
};

const sendResetPasswordLink = async (email) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  const token = generateUniqueToken();
  const minutes = 10;
  const now = new Date();
  const expiryTime = new Date(now.getTime() + minutes * 60 * 1000);

  await Verification.create({
    userId: user.id,
    token,
    type: "password",
    expiryTime,
  });

  // send email
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Reset your password on HabaPay",
    text: `You are receiving this email because you (or someone else) have requested to reset your password on HabaPay.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    ${process.env.RESET_PASSWORD_CLIENT_URL}?token=${token}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  await sendEmail(mailOptions);
  return true;
};

module.exports = {
  verifyGoogleToken,
  checkLogin,
  hashPassword,
  comparePassword,
  generateMpesaAccessToken,
  pinLogin,
  createOrUpdateLoginPin,
  generateUniquePin,
  generateUniqueToken,
  sendResetPasswordLink,
  updatePassword,
};
