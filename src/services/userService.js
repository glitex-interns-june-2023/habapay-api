const PhoneNotRegisteredError = require("../errors/PhoneNotRegisteredError");
const PhoneNotVerifiedError = require("../errors/PhoneNotVerifiedError");
const { User, Business } = require("../models");
const { hashPassword } = require("../services/authService");
const paginator = require("../middlewares/paginator");
const { createAccountCreationLog } = require("./loggingService");
const UserNotFoundError = require("../errors/UserNotFoundError");

const findByGoogleId = async (googleId) => {
  const user = await User.findOne({
    where: {
      googleId,
    },
    raw: true,
  });

  if (!user) return null;

  return user;
};

const findByEmail = async (email) => {
  const foundUser = await User.findOne({
    where: {
      email: email,
    },
  });
  return foundUser;
};

const findByPhone = async (phone) => {
  const user = await User.findOne({ where: { phone } });
  return user;
};

const findById = async (userId) => {
  const user = await User.findByPk(userId)
  if (!user) throw new UserNotFoundError("No user with the given ID was found");
  return user;
}

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
  if (!user.isPhoneVerified) {
    throw new PhoneNotVerifiedError(phone);
  }

  return user;
};

const saveUser = async (data) => {
  const { password } = data;

  const hashedPassword = password ? hashPassword(password) : null;

  let user = await User.create({
    ...data,
    password: hashedPassword,
  });

  // query the user from database to remove hidden attributes
  user = await User.findByPk(user.id);

  // Create default wallet for the user
  await user.createWallet();

  // create a default business account for the user
  await user.createBusiness({
    name: `${user.firstName} ${user.lastName}' Business`,
  });

  // initialize user analytics model
  await user.createAnalytic();

  // save log
  createAccountCreationLog(user);

  const userData = await user.get({ raw: true });
  return userData;
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

const setPhoneVerified = async (userId) => {
  const updatedUser = await User.update(
    { isPhoneVerified: true },
    { where: { id: userId } }
  );

  if (!updatedUser) {
    throw new Error("Could not update user verification status");
  }

  return updatedUser;
};

const setEmailVerified = async (userId) => {
  const updatedUser = await User.update(
    { isEmailVerified: true },
    { where: { id: userId } }
  );

  if (!updatedUser) {
    throw new Error("Could not update user verification status");
  }

  return updatedUser;
};

const getAllUsers = async (page, perPage) => {
  page = parseInt(page);
  perPage = parseInt(perPage);

  const offset = (page - 1) * perPage;
  const users = await User.scope(["defaultScope", "user"]).findAndCountAll({
    offset,
    limit: perPage,
    raw: true,
  });

  const paginatedData = paginator(users, page, perPage);

  return paginatedData;
};

const createAdmin = async (data) => {
  const { password, loginPin, businessName, ...rest } = data;
  const hashedPassword = password ??  hashPassword(password);
  const hashedLoginPin = loginPin ?? hashPassword(loginPin);
  let user = await User.create({
    ...rest,
    role: "admin",
    password: hashedPassword,
    loginPin: hashedLoginPin,
  });

  // query the user from database to remove hidden attributes
  user = await User.findByPk(user.id);

  // Create default wallet for the user
  await user.createWallet();

  // create a default business account for the user
  await user.createBusiness({
    name: `${businessName}`,
    location: rest.location,
  });

  const userData = await user.get({ raw: true });
  return userData;
};
const updateUser = async (userId, data) => {
  if (data.password) {
    data.password = hashPassword(data.password);
  }

  if (data.loginPin) {
    data.loginPin = hashPassword(data.loginPin);
  }

  // upodate business information too
  if (data.businessName) {
    await Business.update({ name: data.businessName }, { where: { userId } });
  }
  if (data.location) {
    await Business.update({ location: data.location }, { where: { userId } });
  }

  let user = await User.update(data, {
    where: {
      id: userId,
    },
  });

  return user;
};
module.exports = {
  findByGoogleId,
  findByEmail,
  findByPhone,
  findById,
  saveUser,
  deleteUser,
  updatePhoneNumber,
  setPhoneVerified,
  setEmailVerified,
  ensurePhoneRegistered,
  ensurePhoneVerified,
  getAllUsers,
  createAdmin,
  updateUser,
};
