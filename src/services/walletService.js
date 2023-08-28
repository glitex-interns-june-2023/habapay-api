const { Wallet } = require("../models");
const userService = require("../userService");
const transactionService = require("../transactionService");
const mpesaService = require("../services/mpesaService");

const getBalance = async (userId) => {
  const wallet = await getWallet(userId);

  return wallet.balance;
};

const sendMoney = async (senderId, receiverId, amount) => {
  const senderWallet = await getWallet(senderId);
  const receiverWallet = await getWallet(receiverId);

  verifyCanSend(senderWallet, amount);

  await transferFunds(senderWallet, receiverWallet, amount);

  const transaction = await transactionService.createSendTransaction(
    senderWallet,
    receiverWallet,
    amount
  );

  return transaction;
};

const getWallet = async (userId) => {
  const wallet = await Wallet.findOne({
    where: {
      userId,
    },
  });

  if (!wallet) {
    const error = new Error(`No wallet found for userId: ${userId}`);
    error.statusCode = 404;
    throw error;
  }

  return wallet;
};

const verifyCanSend = (wallet, amount) => {
  if (wallet.balance < amount) {
    const error = new Error(
      `Transaction failed. You have insufficient funds to send ${wallet.currency} ${amount}. Your available account balance is ${wallet.currency} ${wallet.balance}`
    );
    error.statusCode = 400;
    throw error;
  }
  return true;
};

const verifyCanWithdraw = (wallet, amount) => {
  if (wallet.balance < amount) {
    const error =
      new Error(`Transaction failed. You have insufficient funds to withdraw ${wallet.currency} ${amount}. 
        Your current account balance is ${wallet.currency} ${wallet.balance}`);
    error.statusCode = 400;
    throw error;
  }

  return true;
};

const withdrawMoney = async (senderId, receiverId, amount) => {
  const senderWallet = await getWallet(senderId);
  const receiverWallet = await getWallet(receiverId);
  verifyCanWithdraw(senderWallet, amount);

  await transferFunds(senderWallet, receiverWallet, amount);
  const transaction = await transactionService.createWithdrawTransaction(
    senderWallet,
    receiverWallet,
    amount
  );
  return transaction;
};

const transferFunds = async (senderWallet, receiverWallet, amount) => {
  senderWallet.balance -= amount;
  await senderWallet.save();

  receiverWallet.balance += amount;
  await receiverWallet.save();
};

const depositMoney = async (senderPhone, mpesaNumber, amount) => {
  const sender = await userService.ensurePhoneRegistered(senderPhone);
  await mpesaService.sendStkPush(mpesaNumber, amount);
  const wallet = await getWallet(sender.id);
  wallet.balance += amount;
  await wallet.save();
};

module.exports = {
  getWallet,
  getBalance,
  sendMoney,
  withdrawMoney,
  depositMoney,
};
