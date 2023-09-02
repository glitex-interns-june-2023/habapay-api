const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const {
  validateInput,
  validateInputs,
  validateQueryParam,
} = require("../middlewares/inputValidation");

const {
  sendMoney,
  getBalance,
  depositMoney,
  withdrawMoney,
  confirmDetails,
} = require("../controllers/walletController");

router.get(
  "/balance",
  [
    query("phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("Phone must be between 10 and 13 characters long"),
    validateQueryParam,
  ],
  getBalance
);

router.get(
  "/confirm-details",
  [
    query("phone")
      .notEmpty()
      .withMessage("Query param phone is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("Phone must be between 10 and 13 characters"),
    validateQueryParam,
  ],
  confirmDetails
);

router.post(
  "/send-money",
  [
    body("senderPhone")
      .notEmpty()
      .withMessage("Sender phone is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("Phone must be between 10 and 13 characters"),
    body("receiverPhone")
      .notEmpty()
      .withMessage("Receiver phone is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("Phone must be between 10 and 13 characters"),
    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount should be numeric")
      .toFloat(),
    validateInputs,
  ],
  sendMoney
);

router.post(
  "/deposit",
  [
    body("senderPhone")
      .notEmpty()
      .withMessage("Phone to deposit from is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("Phone must be between 10 and 13 characters"),
    body("mpesaNumber")
      .notEmpty()
      .withMessage("M-Pesa number is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("M-Pesa number must be between 10 and 13 characters"),
    body("amount")
      .notEmpty()
      .withMessage("Amount to deposit is required")
      .isNumeric()
      .withMessage("Amount should be numeric")
      .toFloat(),
    validateInput,
  ],
  depositMoney
);

router.post(
  "/withdraw",
  [
    body("senderPhone")
      .notEmpty()
      .withMessage("Sender phone is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("Phone must be between 10 and 13 characters"),
    body("receiverPhone")
      .notEmpty()
      .withMessage("Receiver phone is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("Phone must be between 10 and 13 characters"),
    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount should be numeric")
      .toFloat(),
    validateInputs,
  ],
  withdrawMoney
);

module.exports = router;
