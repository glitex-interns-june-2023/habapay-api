const { formatTimestamp } = require("../utils");

const formatAllUsers = (users) => {
  const formattedUsers = users.map((user) => {
    const {
      id,
      username,
      phone,
      email,
      isActive,
      "wallet.currency": currency = "Ksh",
      "wallet.balance": balance = "0.00",
    } = user;

    return {
      id,
      username,
      phone,
      email,
      status: isActive ? "Active" : "Suspended",
      currency,
      balance,
    };
  });

  return formattedUsers;
};

const formatUserActivity = (activity) => {
  const formattedActivity = activity.map((log) => {
    const { id, route, message, type, createdAt, "user.userId": userId } = log;

    return {
      id,
      userId,
      message,
      type,
      timestamp: formatTimestamp(createdAt),
    };
  });

  return formattedActivity;
};

module.exports = {
  formatAllUsers,
  formatUserActivity,
};
