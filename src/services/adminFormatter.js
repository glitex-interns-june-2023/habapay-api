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

module.exports = {
  formatAllUsers,
};
