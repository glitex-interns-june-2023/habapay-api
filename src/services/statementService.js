const { Transaction } = require("../models");
const { Op } = require("sequelize");

// get statements by a certain user id
const getStatement = async (
  userId,
  { transactionType, startDate, endDate }
) => {
  const queryOptions = {
    where: {
      userId,
      type: transactionType,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  };

  const statements = await Transaction.findAll(queryOptions);

  return statements;
};

module.exports = {
  getStatement,
};
