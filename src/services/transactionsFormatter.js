const { formatTimestamp } = require("../utils");

const formatSentUserTransactions = (transactions) => {
  const formattedData = transactions.reduce((acc, transaction) => {
    const transactionDate = transaction.timestamp.toDateString();

    const fullName = `${transaction["receiver.firstName"]} ${transaction["receiver.lastName"]}`;
    const phone = transaction["receiver.phone"];

    const existingEntry = acc.find((entry) => entry.date === transactionDate);
    // create new entry if none exists
    if (!existingEntry) {
      acc.push({
        date: transactionDate,
        transactions: [
          {
            transactionId: transaction.id,
            fullName,
            phone,
            currency: transaction.currency,
            amount: transaction.amount,
            type: transaction.type,
            timestamp: formatTimestamp(transaction.timestamp).split(", ")[1],
          },
        ],
      });
    } else {
      existingEntry.transactions.push({
        transactionId: transaction.id,
        fullName,
        phone,
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

const formatReceivedUserTransactions = (transactions) => {
  const formattedData = transactions.reduce((acc, transaction) => {
    const transactionDate = transaction.timestamp.toDateString();

    const fullName = `${transaction["sender.firstName"]} ${transaction["sender.lastName"]}`;
    const phone = transaction["sender.phone"];
    const type = "received";

    const existingEntry = acc.find((entry) => entry.date === transactionDate);
    // create new entry if none exists
    if (!existingEntry) {
      acc.push({
        date: transactionDate,
        transactions: [
          {
            transactionId: transaction.id,
            fullName,
            phone,
            currency: transaction.currency,
            amount: transaction.amount,
            type,
            timestamp: formatTimestamp(transaction.timestamp).split(", ")[1],
          },
        ],
      });
    } else {
      existingEntry.transactions.push({
        transactionId: transaction.id,
        fullName,
        phone,
        currency: transaction.currency,
        amount: transaction.amount,
        type,
        timestamp: formatTimestamp(transaction.timestamp).split(", ")[1],
      });
    }
    return acc;
  }, []);
  return formattedData;
};

/**
 * Json string representation for transaction
 * Note this is not the same as the transaction model, it's a plain javascript object
 * It has no nested values, that's why accessing fields like firstName is done like transaction["sender.firstName"]
 * @param {JSON} transactions
 * @returns
 */
const formatAllTransactions = (transactions) => {
  const formattedData = transactions.reduce((acc, transaction) => {
    const transactionDate = transaction.timestamp.toDateString();

    const fullName = `${transaction["sender.firstName"]} ${transaction["sender.lastName"]}`;
    const phone = transaction["sender.phone"];

    const existingEntry = acc.find((entry) => entry.date === transactionDate);
    // create new entry if none exists
    if (!existingEntry) {
      acc.push({
        date: transactionDate,
        transactions: [
          {
            transactionId: transaction.id,
            fullName,
            phone,
            currency: transaction.currency,
            amount: transaction.amount,
            type: transaction.type,
            timestamp: formatTimestamp(transaction.timestamp).split(", ")[1],
          },
        ],
      });
    } else {
      existingEntry.transactions.push({
        transactionId: transaction.id,
        fullName,
        phone,
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

/**
 * Format user transactions
 * @param {*} transactions
 * @returns
 */
const formatAllUserTransactions = (transactions, user) => {
  const getUser = (transaction) => {
    const sender = {
      fullName: `${transaction["sender.firstName"]} ${transaction["sender.lastName"]}`,
      phone: `${transaction["sender.phone"]}`,
    };

    const receiver = {
      fullName: `${transaction["receiver.firstName"]} ${transaction["receiver.lastName"]}`,
      phone: `${transaction["receiver.phone"]}`,
    };

    const type = transaction.type;

    switch (type) {
      case "sent":
        return transaction.senderId == user.id ? receiver : sender;
      case "withdraw":
        return sender;
      case "deposit":
        return sender;
    }
  };

  const getType = (transaction) => {
    // mark received transactions
    if (transaction.type == "sent" && transaction.senderId != user.id) {
      return "received";
    }
    return transaction.type;
  };

  const formattedData = transactions.reduce((acc, transaction) => {
    const transactionDate = transaction.timestamp.toDateString();

    const existingEntry = acc.find((entry) => entry.date === transactionDate);
    // create new entry if none exists
    if (!existingEntry) {
      acc.push({
        date: transactionDate,
        transactions: [
          {
            transactionId: transaction.id,
            fullName: getUser(transaction).fullName,
            phone: getUser(transaction).phone,
            currency: transaction.currency,
            amount: transaction.amount,
            type: getType(transaction), // for formatting received transactions
            timestamp: formatTimestamp(transaction.timestamp).split(", ")[1],
          },
        ],
      });
    } else {
      existingEntry.transactions.push({
        transactionId: transaction.id,
        fullName: getUser(transaction).fullName,
        phone: getUser(transaction).phone,
        currency: transaction.currency,
        amount: transaction.amount,
        type: getType(transaction), // for formatting received transactions
        timestamp: formatTimestamp(transaction.timestamp).split(", ")[1],
      });
    }
    return acc;
  }, []);
  return formattedData;
};

module.exports = {
  formatSentUserTransactions,
  formatReceivedUserTransactions,
  formatAllTransactions,
  formatAllUserTransactions,
};
