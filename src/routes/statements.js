const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const {
  validateInput,
  validateQueryParam,
} = require("../middlewares/inputValidation");
const { downloadStatement } = require("../controllers/statementController");

router.post(
  "/download",
  [
    body("transactionType")
      .notEmpty()
      .withMessage("Transaction type is required"),
    body("startDate").notEmpty().withMessage("Start date is required").isDate(),
    body("endDate").notEmpty().withMessage("End date is required").isDate(),
    body("email").isEmail().withMessage("Email is required"),
    validateInput,
  ],
  downloadStatement
);

module.exports = router;
