const { User } = require("../models");
const paginator = require("../middlewares/paginator");

const getAdminsWithPagination = async (page, perPage) => {
  page = parseInt(page);
  perPage = parseInt(perPage);

  const offset = (page - 1) * perPage;
  try {
    const admins = await User.scope(["defaultScope", "admin"]).findAndCountAll({
      offset,
      limit: perPage,
      raw: true
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

module.exports = {
  getAdminsWithPagination,
  getAdmin,
};
