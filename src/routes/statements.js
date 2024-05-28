const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validateInput } = require("../middlewares/inputValidation");
const { downloadStatement } = require("../controllers/statementController");

router.post("/download", [
    body("transactionType").notEmpty().withMessage("Transaction type is required"),
    body("startDate").isDate(),
    body("endDate").isDate(),
    body("email").isEmail().withMessage("Email is required"),
    validateInput,  
], downloadStatement);
