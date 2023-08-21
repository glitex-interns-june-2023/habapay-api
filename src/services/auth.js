const { OAuth2Client } = require("google-auth-library");
const { User } = require("../models");
const bcrypt = require("bcrypt");

const verifyGoogleToken = async (token) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload;
  } catch (err) {
    return null;
  }
};

const checkLogin = async (email, password) => {
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return false;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Not password match", passwordMatch)
      return false;
    }

    return user;
  } catch (error) {
    console.log("Error: ", err)
    return false;
  }
};

module.exports = {
  verifyGoogleToken,
  checkLogin,
};
