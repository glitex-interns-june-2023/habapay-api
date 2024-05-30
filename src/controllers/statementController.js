const userService = require("../services/userService");
const transactionService = require("../services/transactionService");
const statementService = require("../services/statementService");
const UserNotFoundError = require("../errors/UserNotFoundError");

const downloadStatement = async (req, res, next) => {
  const { email, startDate, endDate, transactionType } = req.body;

  try {
    const user = await userService.findByEmail(email);

    // get user statement for the specified transaction type and date range
    const transactions = await transactionService.getAllUserTransactions(user, {
      type: transactionType,
      startDate,
      endDate,
    });

    const statement = await statementService.generateStatement({
      ...transactions,
      transactionType,
    });

    return res.status(200).json({
      success: true,
      data: statement,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  downloadStatement,
};
