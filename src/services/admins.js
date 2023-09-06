const { User, Wallet, Business, Log } = require("../models");
const paginator = require("../middlewares/paginator");
const {
  formatAllUsers,
  formatUserActivity,
  formatAdminUser,
  formatNewUsers,
} = require("../services/adminFormatter");
const UserNotFoundError = require("../errors/UserNotFoundError");

const getAdminsWithPagination = async (page, perPage) => {
  page = parseInt(page);
  perPage = parseInt(perPage);

  const offset = (page - 1) * perPage;
  try {
    const admins = await User.scope(["defaultScope", "admin"]).findAndCountAll({
      offset,
      limit: perPage,
      raw: true,
    });

    if (!admins) {
      const error = new Error("No admins found");
      error.statusCode = 404;
      throw error;
    }

    const paginatedData = paginator(admins, page, perPage);

    return paginatedData;
  } catch (error) {
    throw error;
  }
};

const getAdmin = async (adminId) => {
  try {
    const admin = await User.scope(["defaultScope", "admin"]).findByPk(adminId);

    if (!admin) {
      const error = new Error("No admin with the given id was found");
      error.statusCode = 404;
      throw error;
    }

    return admin;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async (page, perPage) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  const offset = (page - 1) * perPage;

  const users = await User.scope("user").findAndCountAll({
    offset,
    limit: perPage,
    attributes: ["id", "username", "phone", "email", "isActive"],
    include: {
      model: Wallet,
      as: "wallet",
      attributes: ["balance", "currency"],
    },
    raw: true,
  });

  const { data, ...paginationInfo } = paginator(users, page, perPage);

  const formattedData = formatAllUsers(data);

  return { ...paginationInfo, data: formattedData };
};

const getUser = async (userId) => {
  // get user information along with their activity
  const user = await User.scope(["defaultScope", "user"]).findByPk(userId, {
    attributes: [
      "id",
      "username",
      "email",
      "phone",
      "secondaryPhone",
      "location",
      "isActive",
      "isPhoneVerified",
      "isEmailVerified",
      "createdAt",
    ],
    include: [
      {
        model: Wallet,
        as: "wallet",
        attributes: ["balance", "currency"],
      },
      {
        model: Business,
        as: "business",
        attributes: ["name", "location", "category", "createdAt"],
      },
    ],
    raw: true,
    nest: true,
  });

  const formattedData = formatAdminUser(user);
  return formattedData;
};

const getUserActivity = async (userId, type, page, perPage) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  const offset = (page - 1) * perPage;

  const queryOptions = {
    offset,
    limit: perPage,
    where: {
      userId,
    },
    attributes: ["id", "message", "type", "createdAt"],
    include: {
      model: User,
      as: "user",
      attributes: [["id", "userId"]],
    },
    order: [["createdAt", "DESC"]],
    raw: true,
  };

  if (type) {
    queryOptions.where.type = type;
  }

  const activity = await Log.findAndCountAll(queryOptions);

  const { data, ...paginationInfo } = paginator(activity, page, perPage);

  const formattedData = formatUserActivity(data);

  return { ...paginationInfo, data: formattedData };
};

const getUsersActivity = async (type, page, perPage) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  const offset = (page - 1) * perPage;

  const queryOptions = {
    offset,
    limit: perPage,
    attributes: ["id", "message", "type", "createdAt"],
    include: {
      model: User,
      as: "user",
      attributes: [["id", "userId"]],
    },
    order: [["createdAt", "DESC"]],
    raw: true,
  };

  if (type) {
    queryOptions.where.type = type;
  }

  const activity = await Log.findAndCountAll(queryOptions);

  const { data, ...paginationInfo } = paginator(activity, page, perPage);

  const formattedData = formatUserActivity(data);

  return { ...paginationInfo, data: formattedData };
};



const getNewUsers = async (page, perPage) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  const offset = (page - 1) * perPage;

  const users = await User.scope("user").findAndCountAll({
    offset,
    limit: perPage,
    attributes: ["id", "username", "email", "createdAt"],
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  const { data, ...paginationInfo } = paginator(users, page, perPage);

  const formattedData = formatNewUsers(data);

  return { ...paginationInfo, data: formattedData };
};

const suspendUser = async (userId) => {
  const suspend = await User.update(
    {
      isActive: false,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  return suspend;
};

const unSuspendUser = async (userId) => {
  const unSuspend = await User.update(
    {
      isActive: true,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  return unSuspend;
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new UserNotFoundError(`No user with id: ${userId} was found`);
  }

  await user.destroy();

  return true;
};

module.exports = {
  getAdminsWithPagination,
  getAdmin,
  getAllUsers,
  getUser,
  getNewUsers,
  getUserActivity,
  getUsersActivity,
  suspendUser,
  unSuspendUser,
  deleteUser,
};
