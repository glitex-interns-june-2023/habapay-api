const walletService = require("../services/walletService");
const userService = require("../services/user");

const getBalance = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const { id } = await userService.findByPhone(phone);
    
    const wallet = await walletService.getWallet(userId);
    const balance = await walletService.getBalance(userId);

    const response = {
      userId: userId,
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
