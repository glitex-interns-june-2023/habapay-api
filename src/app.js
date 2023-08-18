const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { snakeCaseFormatter } = require("./middlewares/snakeCaseFormatter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(snakeCaseFormatter);

// api routes
app.get("/", (req, res, next) => {
  res.send("Welcome to habapay api");
});

app.get("/api/v1/test", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to habapay api",
    someData: "New data here",
    anotherKey: "Another key here",
    oneMoreKeyThatWasHere: "This is one more key here"
  });
});

app.get("/api/v1/test/correct", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to habapay api",
    some_data: "New data here",
    another_key: "Another key here",
  });
});

// import routes
const auth = require("./routes/auth");
const googleAuth = require("./routes/googleAuth");

app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/google", googleAuth);


module.exports = app;