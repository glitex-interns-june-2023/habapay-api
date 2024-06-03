const { verifyDepositTransactions } = require("../services/walletService");
const checkTransactionStatus = async (req, res, next) => {
  await verifyDepositTransactions(req.user);
  next();
};

module.exports = checkTransactionStatus;
