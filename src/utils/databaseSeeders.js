const { hashPassword } = require("../services/auth");
const faker = require("faker");
const roles = ["superadmin", "admin", "user"];
const pickRandomRole = () => {
  const randomIndex = Math.floor(Math.random() * roles.length);
  return roles[randomIndex];
};

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

  for (let i = 0; i < size - 2; i++) {
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
    balance: 0.00,
    currency: "Ksh",
    updatedAt: faker.date.past(),
  });

  wallets.push({
    userId: 2,
    balance: 1000.00,
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
}


module.exports = {
  generateUsers,
  generateWallets
};
