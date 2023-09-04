const { User, Wallet } = require("../models");
const paginator = require("../middlewares/paginator");
const { formatAllUsers } = require("../services/adminFormatter");

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
    raw: true
  });

  const { data, ...paginationInfo } = paginator(users, page, perPage);

  const formattedData = formatAllUsers(data);

  return { ...paginationInfo, data: formattedData };
};

module.exports = {
  getAdminsWithPagination,
  getAdmin,
  getAllUsers,
};
