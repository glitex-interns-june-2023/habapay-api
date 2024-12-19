const walletService = require("../services/walletService");
const userService = require("../services/userService");
const UserNotFoundError = require("../errors/UserNotFoundError");
const { formatTimestamp } = require("../utils");
const PhoneNotRegisteredError = require("../errors/PhoneNotRegisteredError");
const UnauthorizedOperationError = require("../errors/UnauthorizedOperationError");

const getBalance = async (req, res, next) => {
  try {
    const { phone } = req.query;
    const user = await userService.findByPhone(phone);
    if (!user) {
      throw new PhoneNotRegisteredError(phone);
    }

    // verify deposit transactions of each user
    await walletService.verifyDepositTransactions(user);

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
      message: "Wallet balance retrieved successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const sendMoney = async (req, res, next) => {
  try {
    const { senderPhone, receiverPhone, amount } = req.body;
    if (senderPhone === receiverPhone) {
      throw new UnauthorizedOperationError("You cannot send money to yourself");
    }

    const sender = await userService.findByPhone(senderPhone);
    const receiver = await userService.findByPhone(receiverPhone);
    const transaction = await walletService.sendMoney(
      sender.id,
      receiver.id,
      amount
    );

    const senderWallet = await walletService.getWallet(sender.id);
    const balance = senderWallet.balance;
    const timestamp = formatTimestamp(transaction.timestamp);

    const message = `${transaction.id} Confirmed. ${transaction.currency}. ${transaction.amount} sent to ${receiver.username} ${receiver.phone} on ${timestamp}. New wallet balance is ${senderWallet.currency} ${balance}`;

    return res.status(200).json({
      success: true,
      message: "Send money sucessful. Thank you for using HabaPay",
      data: {
        transactionId: transaction.id,
        transactionMessage: message,
        amount: amount,
        currency: transaction.currency,
        timestamp: timestamp,
        balance: balance,
      },
    });
  } catch (error) {
    next(error);
  }
};

const confirmDetails = async (req, res, next) => {
  const { phone } = req.query;
  try {
    const user = await userService.findByPhone(phone);
    if (!user) {
      throw new PhoneNotRegisteredError(phone);
    }

    const response = {
      phone: user.phone,
      fullName: `${user.firstName} ${user.lastName}`,
    };

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const withdrawMoney = async (req, res, next) => {
  const { senderPhone, receiverPhone, amount } = req.body;
  try {
    const sender = await userService.findByPhone(senderPhone);
    const receiver = await userService.findByPhone(receiverPhone);

    if (!sender) {
      throw new UserNotFoundError(
        `No sender with phone: ${senderPhone} was found.`
      );
    }
    if (!receiver) {
      throw new UserNotFoundError(
        `No receiver with phone: ${receiverPhone} was found.`
      );
    }

    const transaction = await walletService.withdrawMoney(
      sender.id,
      receiver.id,
      amount
    );

    const wallet = await walletService.getWallet(sender.id);
    const balance = wallet.balance;
    const timestamp = formatTimestamp(transaction.timestamp);

    const message = `${transaction.id} Confirmed. Withdraw of ${transaction.currency}. ${transaction.amount} to ${receiver.username}, ${receiver.phone} on ${timestamp}. New wallet balance is ${wallet.currency} ${balance}.`;

    const response = {
      transactionId: transaction.id,
      transactionMessage: message,
      amount: transaction.amount,
      currency: transaction.currency,
      timestamp: timestamp,
      balance: balance,
    };

    return res.status(200).json({
      success: true,
      message: "Withdraw successful",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const depositMoney = async (req, res, next) => {
  const { userId, transactionRef, amount } = req.body;
  try {
    const transaction = await walletService.depositMoney(
      userId,
      transactionRef,
      amount
    );

    console.log("Transaction: ", transaction);

    const wallet = await walletService.getWallet(userId);
    const balance = wallet.balance;
    const timestamp = formatTimestamp(transaction.timestamp);

    const message = `${transaction.id} Confirmed. Deposit of ${transaction.currency} ${transaction.amount} to ${user.username},${user.phone} on ${timestamp}. New wallet balance is ${wallet.currency} ${balance}.`;
    const response = {
      transactionId: transaction.id,
      transactionMessage: message,
      amount: transaction.amount,
      currency: transaction.currency,
      timestamp: timestamp,
      balance: balance,
    };

    return res.status(200).json({
      success: true,
      message: "Deposit successful",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBalance,
  confirmDetails,
  sendMoney,
  withdrawMoney,
  depositMoney,
};
