const { sequelize, User, Business } = require("../models");
const BusinessNotFoundError = require("../errors/BusinessNotFoundError");

const getBusinessByUserId = async (userId) => {
  const business = await Business.findOne({
    where: {
      userId,
    },
  });

  const data = business.get({ plain: true });
  return data;
};

const updateUserBusiness = async (userId, data) => {
  const business = await Business.findOne({
    where: {
      userId,
    },
  });

  if (!business) {
    throw new BusinessNotFoundError(userId);
  }

  await business.update(data);
  const businessData = business.get({ plain: true });

  return businessData;
};
module.exports = {
  getBusinessByUserId,
  updateUserBusiness,
};
