const PhoneNotRegisteredError = require("../errors/PhoneNotRegisteredError");
const PhoneNotVerifiedError = require("../errors/PhoneNotVerifiedError");
const { User } = require("../models");
const user = require("../models/user");
const { hashPassword } = require("../services/auth");

const findByGoogleId = async (googleId) => {
  const user = await User.findOne({ where: { googleId } });
  if (!user) return null;

  return user;
};

const findByEmail = async (email) => {
  const foundUser = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!foundUser) return null;

  return foundUser;
};

const findByPhone = async (phone) => {
  const user = await User.findOne({
    where: {
      phone,
    },
  });
  if (!user) return null;

  return user;
};

const ensurePhoneRegistered = async (phone) => {
  const user = await findByPhone(phone);
  if (!user) {
    throw new PhoneNotRegisteredError(phone);
  }
  return user;
};

const ensurePhoneVerified = async (phone) => {
  const user = await findByPhone(phone);
  if (!user) {
    throw new PhoneNotRegisteredError(phone);
  }
  if (!user.isVerified) {
    throw new PhoneNotVerifiedError(phone);
  }

  return user;
};

const saveUser = async (data) => {
  const { password } = data;
  const hashedPassword = hashPassword(password);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

const deleteUser = async (email) => {
  const deleteUser = await User.destroy({
    where: {
      email,
    },
  });

  if (!deleteUser) return false;

  return true;
};

const updatePhoneNumber = async (userId, phoneNumber) => {
  const updatedUser = await User.update(
    { phone: phoneNumber },
    { where: { id: userId } }
  );

  if (!updatedUser) {
    throw new Error("Could not update user Phone Number");
  }

  return updatedUser;
};

const setVerified = async (userId) => {
  const updatedUser = await User.update(
    { isVerified: true },
    { where: { id: userId } }
  );

  if (!updatedUser) {
    throw new Error("Could not update user verification status");
  }

  return updatedUser;
};

module.exports = {
  findByGoogleId,
  findByEmail,
  findByPhone,
  saveUser,
  deleteUser,
  updatePhoneNumber,
  setVerified,
  ensurePhoneRegistered,
  ensurePhoneRegistered,
};
