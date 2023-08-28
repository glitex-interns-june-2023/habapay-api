const paginator = require("../middlewares/paginator");
const { Transaction, User, sequelize } = require("../models");
const { formatTimestamp } = require("../utils");

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

const getTransactions = async (type, { page, perPage }) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  const offset = (page - 1) * perPage;

  let queryOptions = {
    offset,
    limit: perPage,
    order: [["timestamp", "DESC"]],
    include: {
      model: User,
      as: "sender",
      attributes: ["firstName", "lastName", "phone"],
    },
    raw: true,
  };

  if (type) {
    queryOptions.where = { type };
  }

  const transactions = await Transaction.findAndCountAll(queryOptions);

  const { data, ...paginatedTransactions } = paginator(
    transactions,
    page,
    perPage
  );

  const groupedTransactions = formatAndGroupTransactions(data);

  const formattedData = { ...paginatedTransactions, data: groupedTransactions };
  return formattedData;
};

/**
 * Json string representation for transaction
 * Note this is not the same as the transaction model, it's a plain javascript object
 * It has no nested values, that's why accessing fields like firstName is done like transaction["sender.firstName"]
 * @param {JSON} transactions
 * @returns
 */
const formatAndGroupTransactions = (transactions) => {
  const formattedData = transactions.reduce((acc, transaction) => {
    const transactionDate = transaction.timestamp.toDateString();

    const existingEntry = acc.find((entry) => entry.date === transactionDate);
    // create new entry if none exists
    if (!existingEntry) {
      acc.push({
        date: transactionDate,
        transactions: [
          {
            full_name: `${transaction["sender.firstName"]} ${transaction["sender.lastName"]}`,
            phone: transaction["sender.phone"],
            currency: transaction.currency,
            amount: transaction.amount,
            type: transaction.type,
            timestamp: formatTimestamp(transaction.timestamp).split(",")[1],
          },
        ],
      });
    } else {
      existingEntry.transactions.push({
        full_name: `${transaction["sender.firstName"]} ${transaction["sender.lastName"]}`,
        phone: transaction["sender.phone"],
        currency: transaction.currency,
        amount: transaction.amount,
        type: transaction.type,
        timestamp: formatTimestamp(transaction.timestamp).split(", ")[1],
      });
    }
    return acc;
  }, []);
  return formattedData;
};

module.exports = {
  createSendTransaction,
  createWithdrawTransaction,
  createDepositTransaction,
  getTransactions,
};
