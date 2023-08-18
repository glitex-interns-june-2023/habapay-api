const { User } = require("../models");

const createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

const findByGoogleId = async (googleId) => {
  const user = await User.findOne({ where: { googleId } });
  return user;
};

const findByEmail = async (email) => {
  try {
    const foundUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (foundUser) return foundUser;
    return false;
  } catch (err) {
    return false;
  }
};

const saveUser = async (user) => {
  const { googleId, email, firstName, lastName, username, profileUrl } = user;

  try {
    const user = await User.create({
      googleId,
      email,
      firstName,
      lastName,
      username,
      profileUrl,
    });
    return user;
  } catch (err) {
    console.log("User save error: ", err);
    return null;
  }
};

module.exports = {
  findByGoogleId,
  findByEmail,
  saveUser,
};
