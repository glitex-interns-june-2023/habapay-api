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

  const savedTransaction = await Transaction.create(transaction);

  if (!savedTransaction) {
    const error = new Error(`Failed to save transaction to database`);
    error.statusCode = 400;
    throw error;
  }

  return savedTransaction;
};

const createWithdrawTransaction = async (
  senderWallet,
  receiverWallet,
  amount
) => {
  const transaction = createTransaction(
    senderWallet,
    receiverWallet,
    amount,
    "withdraw"
  );

  const savedTransaction = await Transaction.create(transaction);

  if (!savedTransaction) {
    const error = new Error(`Failed to save transaction to database`);
    error.statusCode = 400;
    throw error;
  }

  return savedTransaction;
};

const createDepositTransaction = async (senderWallet, amount) => {
  const transaction = createTransaction(
    senderWallet,
    senderWallet,
    amount,
    "deposit"
  );

  const savedTransaction = await Transaction.create(transaction);

  if (!savedTransaction) {
    const error = new Error(`Failed to save transaction to database`);
    error.statusCode = 400;
    throw error;
  }

  return savedTransaction;
};

module.exports = {
  createSendTransaction,
  createWithdrawTransaction,
  createDepositTransaction,
  // getTransactions,
  // getTransaction,
  // updateTransaction,
  // deleteTransaction,
  // getTransactionsByUserId,
};
