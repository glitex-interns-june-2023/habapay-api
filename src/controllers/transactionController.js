const transactionService = require("../services/transactionService");
const getTransactions = async (req, res, next) => {
  const { type, page = 1, perPage = 10 } = req.query;

  try {
    const transactions = await transactionService.getTransactions(type, {
      page,
      perPage,
    });

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTransactions
};
