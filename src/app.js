const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { snakeCaseFormatter } = require("./middlewares/snakeCaseFormatter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(snakeCaseFormatter);

// api routes
app.get("/", (req, res, next) => {
  res.send("Welcome to habapay api");
});

// import routes
const auth = require("./routes/auth");
const googleAuth = require("./routes/googleAuth");
const superAdminRouter = require("./routes/superAdmin");
const adminRouter = require("./routes/admin");

app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/google", googleAuth);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/super-admin", superAdminRouter);

module.exports = app;