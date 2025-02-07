module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password@1",
    database: process.env.DB_NAME || "habapay_dev",
    host: process.env.DB_HOST || "localhost",
    logging: true,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "habapay_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
};
