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
};

const getTransaction = async (req, res, next) => {
  const { id } = req.params;
  try {
    const transaction = await transactionService.getTransaction(id);
    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getUserTransactions = async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, perPage = 10, type } = req.query;
  try {
    let transaction;
    // sent and received transactions need to be handled differently
    if (type == "sent") {
      transaction = await transactionService.getSentUserTransactions(userId, {
        page,
        perPage,
      });
    } else if (type == "received") {
      transaction = await transactionService.getReceivedUserTransactions(
        userId,
        {
          page,
          perPage,
        }
      );
    } else {
      transaction = await transactionService.getUserTransactions(userId, {
        page,
        perPage,
        type,
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  getUserTransactions,
};
