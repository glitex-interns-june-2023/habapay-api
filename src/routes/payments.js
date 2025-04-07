const express = require("express");
const router = express.Router();
const {
  getPaymentRef,
  getPayments,
  mpesaPaymentCallback,
} = require("../controllers/paymentController");
const { query } = require("express-validator");
const { validateQueryParam } = require("../middlewares/inputValidation");

router.get(
  "/ref",
  [
    query("userId").notEmpty().withMessage("userId is required"),
    query("purpose")
      .isIn(["deposit"])
      .withMessage("Invalid or unsupported purpose"),
    validateQueryParam,
  ],
  getPaymentRef
);

router.get("/", getPayments);
router.post("/callback", mpesaPaymentCallback);

module.exports = router;
