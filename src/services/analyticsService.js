const { Transaction, User, Analytic, Wallet, sequelize } = require("../models");
const { Op } = require("sequelize");
const { formatAnalytics } = require("./analyticsFormatterService");

const paginator = require("../middlewares/paginator");

const getOverview = async () => {
  const weeklyTransactions = await getWeeklyTransactions();
  const weeklySignups = await getWeklySignups();
  const weeklyExchanges = await getWeeklyExchanges();
  const totalUsers = await getTotalUsers();
  const totalByCounties = await getReachByCounties();

  return {
    weeklyTransactions: {
      total: weeklyTransactions,
      percentage: 5,
    },
    weeklySignups: {
      total: weeklySignups,
      percentage: 3,
    },
    weeklyExchanges: {
      total: weeklyExchanges,
      percentage: 2,
    },
    nationalReach: {
      total_users: totalUsers,
      totalCounties: totalByCounties,
    },
  };
};

// Get number of transactions per week
const getWeeklyTransactions = async () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Starts on Sunday

  const endOfWeek = new Date(currentDate);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Ends on Saturday

  const count = await Transaction.count({
    where: {
      timestamp: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    },
  });

  return count;
};

// users who have registered per weeek
const getWeklySignups = async () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Starts on Sunday

  const endOfWeek = new Date(currentDate);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Ends on Saturday

  const count = await User.count({
    where: {
      createdAt: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    },
  });

  return count;
};

// get weekly exchanges
const getWeeklyExchanges = async () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Starts on Sunday

  const endOfWeek = new Date(currentDate);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Ends on Saturday

  const count = await Transaction.count({
    where: {
      type: {
        [Op.in]: ["sent"],
      },
      timestamp: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    },
  });

  return count;
};

// users in the system
const getTotalUsers = async () => {
  const count = await User.scope("user").count();
  return count;
};

// reach by counties
const getReachByCounties = async () => {
  const count = await User.count({
    distinct: true,
    col: "location",
  });

  return count;
};

const getRecentActivity = async (page, perPage) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  const offset = (page - 1) * perPage;

  const analytics = await Analytic.findAndCountAll({
    offset,
    limit: perPage,
    attributes: ["id", "userId", "appLaunches"],
    include: {
      model: User,
      as: "user",
      attributes: ["username", "isActive"],
      include: [
        {
          model: Wallet,
          as: "wallet",
          attributes: ["balance"],
        },
      ],
    },

    raw: true,
  });

  const { data, ...paginationInfo } = paginator(analytics, page, perPage);

  const formattedData = formatAnalytics(data);
  return { ...paginationInfo, data: formattedData };
};

module.exports = {
  getOverview,
  getRecentActivity,
};
