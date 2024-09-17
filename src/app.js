const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { snakeCaseFormatter } = require("./middlewares/snakeCaseFormatter");
const errorHandler = require("./middlewares/errorHandler");
const { sequelize } = require("./models");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(snakeCaseFormatter);

// api routes
app.get("/", (req, res, next) => {
  res.send("Welcome to Habapay API v1.0.0");
});
app.get("/test", (req, res, next) => {
  res.send("It Works!");
});

// import routes
const auth = require("./routes/auth");
const googleAuth = require("./routes/googleAuth");
const superAdminRouter = require("./routes/superAdmin");
const adminRouter = require("./routes/admins");
const walletRouter = require("./routes/wallet");
const mpesaRouter = require("./routes/mpesa");
const transactionsRouter = require("./routes/transactions");
const usersRouter = require("./routes/users");
const verificationsRouter = require("./routes/verifications");
const analyticsRouter = require("./routes/analytics");
const statementRouter = require("./routes/statements");

app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/google", googleAuth);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/super-admin", superAdminRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/mpesa", mpesaRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/verifications", verificationsRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/statement", statementRouter);
// error handler
app.use(errorHandler);
if (process.env.NODE_ENV === 'development') {
  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("Models synced successfully");
    })
    .catch((err) => {
      console.log("Error syncing models", err);
    });
}
module.exports = app;
