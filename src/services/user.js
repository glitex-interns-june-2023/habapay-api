const { User } = require("../models");
const user = require("../models/user");
const { hashPassword } = require("../services/auth");

const findByGoogleId = async (googleId) => {
  try {
    const user = await User.findOne({ where: { googleId } });
    if (!user) return null;
    return user;
  } catch (error) {
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    const foundUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (foundUser) return foundUser;
    return null;
  } catch (error) {
    throw error;
  }
};

const findByPhone = async (phone) => {
  try {
    const user = await User.findOne({
      where: {
        phone,
      },
    });
    if (!user) return null;

    return user;
  } catch (error) {
    throw error;
  }
};

const saveUser = async (data) => {
  const { password } = data;
  const hashedPassword = hashPassword(password);

  try {
    const user = await User.create({
      ...data,
      password: hashedPassword,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (email) => {
  try {
    const deleteUser = await User.destroy({
      where: {
        email,
      },
    });
    if (!deleteUser) return false;

    return true;
  } catch (error) {
    console.log("Delete User error: ", error);
    throw error;
  }
};
module.exports = {
  findByGoogleId,
  findByEmail,
  findByPhone,
  saveUser,
  deleteUser,
};
