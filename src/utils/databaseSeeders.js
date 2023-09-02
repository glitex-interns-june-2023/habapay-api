const { hashPassword } = require("../services/auth");
const faker = require("faker");
const roles = ["superadmin", "admin", "user"];
const transactionTypes = ["deposit", "withdraw", "sent"];
const transactionStatus = ["pending", "approved"]
const pickRandomRole = () => {
  const randomIndex = Math.floor(Math.random() * roles.length);
  return roles[randomIndex];
};
const pickRandomTransactionType = () => {
  const randomIndex = Math.floor(Math.random() * transactionTypes.length);
  return transactionTypes[randomIndex];
};
const pickRandomStatus = () => {
  const randomIndex = Math.floor(Math.random() * transactionStatus.length);
  return transactionStatus[randomIndex];
}

const generateUsers = (size) => {
  let users = [];
  users.push({
    email: "testuser@habapay.com",
    firstName: "Test",
    lastName: "User",
    username: "Test User",
    phone: "0712345678",
    password: hashPassword("12345678"),
  });

  users.push({
    email: "admin@habapay.com",
    firstName: "Admin",
    lastName: "User",
    username: "Admin User",
    phone: "0114662464",
    role: "admin",
    password: hashPassword("12345678"),
  });

  users.push({
    email: "kariuki.joseph121@gmail.com",
    firstName: "Joseph",
    lastName: "N",
    username: "Joe",
    phone: "0114662464",
    role: "admin",
    password: hashPassword("12345678"),
  });

  for (let i = 0; i < size - 3; i++) {
    const user = {
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      phone: faker.phone.phoneNumberFormat(),
      role: pickRandomRole(),
      password: hashPassword("12345678"),
    };

    users.push(user);
  }

  return users;
};

const generateWallets = (size) => {
  let wallets = [];

  wallets.push({
    userId: 1,
    balance: 0.0,
    currency: "Ksh",
    updatedAt: faker.date.past(),
  });

  wallets.push({
    userId: 2,
    balance: 1000.0,
    currency: "Ksh",
    updatedAt: faker.date.past(),
  });

  for (let i = 2; i < size; i++) {
    const wallet = {
      userId: i + 1,
      balance: faker.finance.amount(),
      currency: "Ksh",
      updatedAt: faker.date.past(),
    };

    wallets.push(wallet);
  }

  return wallets;
};

/**
 * Generate random transactons for users with userId between 1-20
 * @param {*} size
 * @returns
 */
const generateTransactions = (size) => {
  let transactions = [
    {
      senderId: 2,
      receiverId: Math.floor(Math.random() * 20) + 1,
      amount: faker.finance.amount(),
      currency: "Ksh",
      type: "sent",
      status: "pending",
      timestamp: faker.date.past(),
    },
    {
      senderId: 2,
      receiverId: Math.floor(Math.random() * 20) + 1,
      amount: faker.finance.amount(),
      currency: "Ksh",
      type: "withdraw",
      status: "approved",
      timestamp: faker.date.past(),
    },
    {
      senderId: 2,
      receiverId: Math.floor(Math.random() * 20) + 1,
      amount: faker.finance.amount(),
      currency: "Ksh",
      type: "deposit",
      status: "approved",
      timestamp: faker.date.past(),
    },
  ];

  for (let i = 2; i < size; i++) {
    const transaction = {
      senderId: Math.floor(Math.random() * 20) + 1,
      receiverId: Math.floor(Math.random() * 20) + 1,
      amount: faker.finance.amount(),
      currency: "Ksh",
      status: pickRandomStatus(),
      type: pickRandomTransactionType(),
      timestamp: faker.date.past(),
    };

    transactions.push(transaction);
  }
  return transactions;
};

module.exports = {
  generateUsers,
  generateWallets,
  generateTransactions,
};
