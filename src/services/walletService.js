const { Wallet } = require("../models");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");

const getBalance = async (userId) => {
  try {
    const wallet = await getWallet(userId);

    return wallet.balance;
  } catch (error) {
    throw error;
  }
};

const sendMoney = async (senderId, receiverId, amount) => {
  try {
    const senderWallet = await getWallet(senderId);
    const receiverWallet = await getWallet(receiverId);

    verifyCanSend(senderWallet, amount);

    await transferFunds(senderWallet, receiverWallet, amount);

    await transactionService.createSendTransaction(
      senderWallet,
      receiverWallet,
      amount
    );

    return senderWallet;
  } catch (error) {
    throw error;
  }
};

const getWallet = async (userId) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

const verifyCanSend = (wallet, amount) => {
  try {
    if (wallet.balance < amount) {
      const error =
        new Error(`Transaction failed. You have insufficient funds to send ${wallet.currency} ${amount}.
        Your available account balance is ${wallet.currency} ${wallet.balance}`);
      error.statusCode = 400;
      throw error;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const verifyCanWithdraw = (wallet, amount) => {
  try {
    if (wallet.balance < amount) {
      const error =
        new Error(`Transaction failed. You have insufficient funds to withdraw ${wallet.currency} ${amount}. 
        Your current account balance is ${wallet.currency} ${wallet.balance}`);
      error.statusCode = 400;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const transferFunds = async (senderWallet, receiverWallet, amount) => {
  senderWallet.balance -= amount;
  await senderWallet.save();

  receiverWallet.balance += amount;
  await receiverWallet.save();
};



module.exports = {
    getWallet,
    getBalance,
    sendMoney,
}