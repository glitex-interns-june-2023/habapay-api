const formatAnalytics = (analytics) => {
  const formattedData = analytics.map((analytic) => {
    const isActive = analytic["user.isActive"];

    return {
      userId: analytic.userId,
      username: analytic["user.username"],
      balance: analytic["user.wallet.balance"],
      totalTransactions: Math.floor(Math.random() * 10),// analytic["user.transactions.totalTransactions"]
      appLaunches: analytic.appLaunches,
      status: isActive ? "Active" : "Suspended",
    };
  });

  return formattedData;
};

module.exports = {
  formatAnalytics,
};
