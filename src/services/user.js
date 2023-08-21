const { User } = require("../models");
const user = require("../models/user");
const { hashPassword } = require("../services/auth");

const findByGoogleId = async (googleId) => {
  try {
    const user = await User.findOne({ where: { googleId } });
    return user;
  } catch (error) {
    return null;
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
  } catch (err) {
    return null;
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
    return null;
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
  } catch (err) {
    console.log("Register user error: ", err);
    return null;
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
    return false;
  }
};
module.exports = {
  findByGoogleId,
  findByEmail,
  findByPhone,
  saveUser,
  deleteUser,
};
