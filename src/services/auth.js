const { OAuth2Client } = require("google-auth-library");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const axios = require("axios");

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
    const err = new Error("Invalid google token");
    err.statusCode = 401;
    throw err;
  }
};

const checkLogin = async (email, password) => {
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
      attributes: {
        include: ["password"],
      },
    });

    if (!user) {
      let error = new Error("No user with such email was found");
      error.statusCode = 404;

      throw error;
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      let error = new Error("Pasword is incorrect");
      error.statusCode = 401;
      throw error;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = (password, hash) => {
  const match = bcrypt.compareSync(password, hash);
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

module.exports = {
  verifyGoogleToken,
  checkLogin,
  hashPassword,
  comparePassword,
  generateMpesaAccessToken,
};
