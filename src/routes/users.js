const express = require("express");
const router = express.Router();
const { getUserTransactions } = require("../controllers/transactionController");
const { param } = require("express-validator");
const { validateRouteParam } = require("../middlewares/inputValidation");
const { getUsers } = require("../controllers/userController");

router.get(
  "/:id/transactions",
  [
    param("id").notEmpty().withMessage("User id is a required parameter"),
    validateRouteParam,
  ],
  getUserTransactions
);

router.get("/", getUsers);

module.exports = router;
