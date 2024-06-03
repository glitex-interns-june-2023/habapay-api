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
            timestamp: transaction.timestamp,
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
        timestamp: transaction.timestamp
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
            timestamp: transaction.timestamp
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
        timestamp: transaction.timestamp
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
            timestamp: transaction.timestamp
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
        timestamp: transaction.timestamp
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
            timestamp: transaction.timestamp
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
        timestamp: transaction.timestamp
      });
    }
    return acc;
  }, []);
  return formattedData;
};

const formatAdminTransactions = (transactions) => {
  const formattedData = transactions.reduce((acc, transaction) => {
    const fullName = `${transaction["sender.firstName"]} ${transaction["sender.lastName"]}`;
    const phone = transaction["sender.phone"];

    const response = {
      transactionId: transaction.id,
      fullName,
      phone,
      currency: transaction.currency,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      timestamp: transaction.timestamp
    };
    acc.push(response);
    return acc;
  }, []);

  return formattedData;
};

const formatCurrency = (amount) => {
  const formatted = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  return formatted;
}
const generateSendMoneyDescription = (transaction) => {
  return `Sent ${transaction.currency}. ${formatCurrency(transaction.amount)} to ${transaction["receiver.firstName"]} ${transaction["receiver.lastName"]}`;
}
const generateReceivedMoneyDescription = (transaction) => {
  return `Received ${transaction.currency}. ${formatCurrency(transaction.amount)} from ${transaction["sender.firstName"]} ${transaction["sender.lastName"]}`;
}
const generateDepositMoneyDescription = (transaction) => {
  return `Deposited ${transaction.currency}. ${formatCurrency(transaction.amount)}`;
}

const generateWithdrawMoneyDescription = (transaction) => {
  return `Withdrew ${transaction.currency}. ${formatCurrency(transaction.amount)}`;
}

// generate transaction description
const generateDescription = (transaction, userId) => {
  const {type} = transaction;
  // format transaction amount to currency
  if(type == 'sent' && transaction.receiverId == userId) {
    return generateReceivedMoneyDescription(transaction);
  }
  if(type == 'sent') {
    return generateSendMoneyDescription(transaction);
  }
  if(type == 'withdraw') {
    return generateWithdrawMoneyDescription(transaction);
  }
  if(type == 'deposit') {
    return generateDepositMoneyDescription(transaction);
  }
  return 'Unknown transaction type';
};

module.exports = {
  formatSentUserTransactions,
  formatReceivedUserTransactions,
  formatAllTransactions,
  formatAllUserTransactions,
  formatAdminTransactions,
  generateDescription,
};
