const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validateInput } = require("../middlewares/inputValidation");
const { downloadStatement } = require("../controllers/statementController");

router.post(
  "/download",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("startDate").notEmpty().withMessage("Start date is required").isDate(),
    body("endDate").notEmpty().withMessage("End date is required").isDate(),
    body("transactionType")
      .notEmpty()
      .withMessage("Transaction type is required"),
    validateInput,
  ],
  downloadStatement
);

module.exports = router;
