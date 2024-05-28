const userService = require("../services/userService");
const transactionService = require("../services/transactionService");
const UserNotFoundError = require("../errors/UserNotFoundError");

const downloadStatement = async (req, res, next) => {
  const { transactionType, startDate, endDate, email } = req.body;

  try {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError("No user with this email was found");
    }
    // get user statement for the specified transaction type and date range
    const transactions = await transactionService.getUserTransactions(user.id, {
        transactionType,
        startDate,
        endDate,
        });

    const statement = await transactionService.generateStatement(user.id, {
      transactionType,
      startDate,
      endDate,
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
