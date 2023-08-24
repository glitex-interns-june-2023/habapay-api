const walletService = require("../services/walletService");
const userService = require("../services/user");
const UserNotFoundError = require("../errors/UserNotFoundError");

const getBalance = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await userService.findByPhone(phone);
    if (!user) {
      throw new UserNotFoundError("No user with the given phone was found");
    }

    const wallet = await walletService.getWallet(user.id);
    const balance = await walletService.getBalance(user.id);

    const response = {
      userId: user.id,
      balance,
      currency: wallet.currency,
      lastUpdate: wallet.updatedAt,
    };

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const sendMoney = async (req, res) => {};

const withdrawMoney = async (req, res) => {};

const depositMoney = async (req, res) => {};

module.exports = {
  getBalance,
  sendMoney,
  withdrawMoney,
  depositMoney,
};
