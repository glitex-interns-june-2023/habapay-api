const { Op } = require("sequelize");
const ResourceNotFoundError = require("../errors/ResourceNotFoundError");
const UserNotFoundError = require("../errors/UserNotFoundError");
const paginator = require("../middlewares/paginator");
const { Transaction, User, sequelize } = require("../models");
const { formatTimestamp } = require("../utils");
const {
  formatAllTransactions,
  formatAllUserTransactions,
  formatSentUserTransactions,
  formatReceivedUserTransactions,
  formatAdminTransactions,
} = require("./transactionsFormatterService");

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
    "sent"
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

  const { data, ...paginationInfo } = paginator(transactions, page, perPage);

  const groupedTransactions = formatAllTransactions(data);

  const formattedData = { ...paginationInfo, data: groupedTransactions };
  return formattedData;
};

const getTransaction = async (transactionId) => {
  transactionId = parseInt(transactionId);
  const transaction = await Transaction.findByPk(transactionId, {
    include: {
      model: User,
      as: "sender",
      attributes: ["firstName", "lastName", "phone"],
    },
    raw: true,
  });
  if (!transaction) {
    throw new ResourceNotFoundError(`/transactions/${transactionId}`);
  }

  const response = {
    transactionId: transaction.id,
    full_name: `${transaction["sender.firstName"]} ${transaction["sender.lastName"]}`,
    phone: transaction["sender.phone"],
    amount: transaction.amount,
    type: transaction.type,
    currency: transaction.currency,
    timestamp: formatTimestamp(transaction.timestamp),
  };

  return response;
};

const getUserTransactions = async (userId, { page, perPage, type }) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  userId = parseInt(userId);

  const user = await User.findByPk(userId);

  const offset = (page - 1) * perPage;
  const queryOptions = {
    where: {
      [Op.or]: {
        senderId: userId,
        receiverId: userId,
      },
    },
    offset,
    limit: perPage,
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["firstName", "lastName", "phone"],
        order: [["timestamp", "DESC"]],
      },
      {
        model: User,
        as: "receiver",
        attributes: ["firstName", "lastName", "phone"],
        order: [["timestamp", "DESC"]],
      },
    ],
    raw: true,
  };

  if (type) {
    if (type == "received") {
      type = "sent";
    }

    queryOptions.where.type = type;
  }

  const transactions = await Transaction.findAndCountAll(queryOptions);

  if (transactions.count == 0) {
    // verify if user is registered or not
    const user = await User.findByPk(userId);
    if (!user) {
      throw new UserNotFoundError(`User with userId: ${userId} was not found`);
    }
  }

  const { data, ...paginationInfo } = paginator(transactions, page, perPage);
  const groupedTransactions = formatAllUserTransactions(data, user);
  const formattedData = { ...paginationInfo, data: groupedTransactions };
  return formattedData;
};

const getSentUserTransactions = async (userId, { page, perPage }) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  userId = parseInt(userId);

  const offset = (page - 1) * perPage;

  const queryOptions = {
    where: {
      senderId: userId,
      type: "sent",
    },
    limit: perPage,
    offset,
    include: {
      model: User,
      as: "receiver",
      attributes: ["firstName", "lastName", "phone"],
    },
    order: [["timestamp", "DESC"]],
    raw: true,
  };

  const transactions = await Transaction.findAndCountAll(queryOptions);

  const { data, ...paginationInfo } = paginator(transactions, page, perPage);
  const groupedTransactions = formatSentUserTransactions(data);
  const formattedData = { ...paginationInfo, data: groupedTransactions };
  return formattedData;
};

const getReceivedUserTransactions = async (userId, { page, perPage }) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  userId = parseInt(userId);

  const offset = (page - 1) * perPage;

  const queryOptions = {
    where: {
      receiverId: userId,
      type: "sent",
    },
    limit: perPage,
    offset,
    include: {
      model: User,
      as: "sender",
      attributes: ["firstName", "lastName", "phone"],
    },
    order: [["timestamp", "DESC"]],
    raw: true,
  };

  const transactions = await Transaction.findAndCountAll(queryOptions);

  const { data, ...paginationInfo } = paginator(transactions, page, perPage);

  const groupedTransactions = formatReceivedUserTransactions(data);
  const formattedData = { ...paginationInfo, data: groupedTransactions };
  return formattedData;
};

const getAdminTransactions = async (status, { page, perPage }) => {
  page = Number(page);
  perPage = Number(perPage);
  const offset = (page - 1) * perPage;

  const queryOptions = {
    where: {
      status,
    },
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

  const transactions = await Transaction.findAndCountAll(queryOptions);
  const { data, ...paginationInfo } = paginator(transactions, page, perPage);
  const adminTransactions = formatAdminTransactions(data);
  const formattedData = { ...paginationInfo, data: adminTransactions };
  return formattedData;
};

const approveTransaction = async (transactionId) => {
  transactionId = parseInt(transactionId);
  const transaction = await Transaction.findByPk(transactionId);
  if (!transaction) {
    throw new ResourceNotFoundError(
      `No transaction with id: ${transactionId} was found`
    );
  }

  transaction.status = "approved";
  await transaction.save();
};

module.exports = {
  createSendTransaction,
  createWithdrawTransaction,
  createDepositTransaction,
  getTransactions,
  getTransaction,
  getUserTransactions,
  getSentUserTransactions,
  getReceivedUserTransactions,
  getAdminTransactions,
  approveTransaction,
};
