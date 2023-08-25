const walletService = require("../services/walletService");
const userService = require("../services/user");
const UserNotFoundError = require("../errors/UserNotFoundError");

const getBalance = async (req, res, next) => {
  try {
    const { phone } = req.query;
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

const sendMoney = async (req, res) => {
  try {
    const { senderPhone, receiverPhone, amount } = req.body;

    const sender = await userService.findByPhone(senderPhone);
    if (!sender) {
      throw new UserNotFoundError(
        `No user with phone :${senderPhone} was found`
      );
    }
    const receiver = await userService.findByPhone(receiverPhone);

    if (!receiver) {
      throw new UserNotFoundError(
        `Receiver with phone: ${receiverPhone} was not found}`
      );
    }

    const transaction = await walletService.sendMoney(
      sender.id,
      receiver.id,
      amount
    );
    
    const senderWallet = await walletService.getWallet(sender.id);
    const balance = senderWallet.balance;

    const message = `${transaction.id} confirmed. ${transaction.currency} ${transaction.amount} sent to ${receiver.username} ${receiver.phone} on ${transaction.timestamp}. New wallet balance is ${balance}`;

    return res.status(200).json({
      success: true,
      message: "Send money sucessful. Thank you for using HabaPay",
      data: {
        transactionMessage: message,
        transactionId: transaction.id,
        newBalance: balance,
      },
    });
    
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const withdrawMoney = async (req, res) => {};

const depositMoney = async (req, res) => {};

module.exports = {
  getBalance,
  sendMoney,
  withdrawMoney,
  depositMoney,
};
