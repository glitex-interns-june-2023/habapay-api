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
    phone: "0767876364",
    password: hashPassword("12345678"),
  });

  users.push({
    email: "admin@habapay.com",
    firstName: "Admin",
    lastName: "User",
    username: "Admin User",
    phone: "0789776445",
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

module.exports = {
  generateUsers,
};
