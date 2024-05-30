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
  generateDescription,
} = require("./transactionsFormatterService");

// base transaction creator function
const createTransaction = (senderWallet, receiverWallet, amount, type) => {
  let senderNewBal = senderWallet.balance;
  let receiverNewBal = receiverWallet.balance;

  if (type === "sent") {
    senderNewBal -= amount;
    receiverNewBal += amount;
  } else if (type === "withdraw") {
    senderNewBal -= amount;
  } else if (type === "deposit") {
    senderNewBal += amount;
  }

  return {
    senderId: senderWallet.userId,
    receiverId: receiverWallet.userId,
    currency: senderWallet.currency,
    senderNewBal,
    receiverNewBal,
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

const getUserTransactions = async (
  userId,
  { page, perPage, type, startDate, endDate }
) => {
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

  if (startDate && endDate) {
    queryOptions.where.timestamp = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  } else if (startDate) {
    queryOptions.where.timestamp = {
      [Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    queryOptions.where.timestamp = {
      [Op.lte]: new Date(endDate),
    };
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

// get all transactions of a user for a ceratain type (To facilitate the generation of the pdf statement)
const getAllUserTransactions = async (user, { type, startDate, endDate }) => {
  const userId = user.id;

  const queryOptions = {
    where: {
      [Op.or]: {
        senderId: userId,
        receiverId: userId,
      },
    },
    order: [["timestamp", "DESC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["firstName", "lastName", "phone"],
      },
      {
        model: User,
        as: "receiver",
        attributes: ["firstName", "lastName", "phone"],
      },
    ],
    raw: true,
  };

  if (type && type !== "all") {
    queryOptions.where.type = type;
  }

  if (startDate && endDate) {
    queryOptions.where.timestamp = {
      [Op.between]: [
        new Date(startDate),
        new Date(endDate).setUTCHours(23, 59, 59),
      ],
    };
  } else if (startDate) {
    queryOptions.where.timestamp = {
      [Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    queryOptions.where.timestamp = {
      [Op.lte]: new Date(endDate).setUTCHours(23, 59, 59),
    };
  }

  const transactions = await Transaction.findAll(queryOptions);

  const options = { day: "2-digit", month: "short", year: "numeric" };

  // calculate summary report of sent, received, deposited and withdrawals
  const sendMoneyTotal = transactions.reduce((acc, transaction) => {
    if (transaction.type === "sent") {
      acc += transaction.amount;
    }
    return acc;
  }, 0);

  const receivedMoneyTotal = transactions.reduce((acc, transaction) => {
    if (transaction.type === "sent" && transaction.receiverId === userId) {
      acc += transaction.amount;
    }
    return acc;
  }, 0);

  const depositTotal = transactions.reduce((acc, transaction) => {
    if (transaction.type === "deposit") {
      acc += transaction.amount;
    }
    return acc;
  }, 0);

  const withdrawalTotal = transactions.reduce((acc, transaction) => {
    if (transaction.type === "withdraw") {
      acc += transaction.amount;
    }
    return acc;
  }, 0);

  const customerDetails = {
    customerName: `${user.firstName} ${user.lastName}`,
    phone: user.phone,
    email: user.email,
    date: new Date().toLocaleDateString("en-GB", options),
    statementPeriod:
      new Date(startDate).toLocaleDateString("en-GB", options) +
      " - " +
      new Date(endDate).toLocaleDateString("en-GB", options),
  };

  const summary = {
    sent: sendMoneyTotal,
    received: receivedMoneyTotal,
    deposit: depositTotal,
    withdrawal: withdrawalTotal,
  };

  const formattedTransactions = transactions.map((transaction) => ({
    date: new Date(transaction.timestamp).toLocaleDateString("en-GB", {
      ...options,
      hour: "2-digit",
      minute: "2-digit",
    }),
    type:
      transaction.type === "sent" && transaction.receiverId === userId
        ? "receive"
        : transaction.type,
    description: generateDescription(transaction, userId),
    status: transaction.status,
    amount: transaction.amount,
    newBalance:
      transaction.receiverId === userId
        ? transaction.receiverNewBal
        : transaction.senderNewBal,
  }));
  

  return {
    customerDetails,
    summary,
    transactions: formattedTransactions,
  };
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
  getAllUserTransactions,
  getSentUserTransactions,
  getReceivedUserTransactions,
  getAdminTransactions,
  approveTransaction,
};
