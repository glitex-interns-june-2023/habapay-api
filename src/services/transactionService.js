const { Transaction } = require("../models");

const createTransaction = (senderWallet, receiverWallet, amount, type) => {
  return {
    senderId: senderWallet.userId,
    receiverId: receiverWallet.userId,
    currency: senderWallet.currency,
    amount,
    type,
    timestamp: new Date(),
  };
};

const createSendTransaction = async (senderWallet, receiverWallet, amount) => {
  const transaction = createTransaction(
    senderWallet,
    receiverWallet,
    amount,
    "send"
  );

  try {
    const savedTransaction = await Transaction.create(transaction);

    if (!savedTransaction) {
      const error = new Error(`Failed to save transaction to database`);
      error.statusCode = 400;
      throw error;
    }

    return savedTransaction;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSendTransaction,
  // getTransactions,
  // getTransaction,
  // updateTransaction,
  // deleteTransaction,
  // getTransactionsByUserId,
};
