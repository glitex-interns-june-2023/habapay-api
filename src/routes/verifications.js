const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const { validateInput } = require("../middlewares/inputValidation");
const {
  sendOTP,
  verifyOTP,
  sendPin,
  verifyPin,
  sendVerificationEmail,
  verifyEmailVerificationToken,
} = require("../controllers/verificationController");

// OTP vefification sent to phone number
router.post(
  "/otp/send",
  [
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("email").notEmpty().withMessage("Email is required"),
    validateInput,
  ],
  sendOTP
);

router.post(
  "/otp/verify",
  [
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
    validateInput,
  ],
  verifyOTP
);

// Verify email via PIN
router.post(
  "/pin/send",
  [body("email").notEmpty().withMessage("Email is required"), validateInput],
  sendPin
);

router.post(
  "/pin/verify",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("pin").notEmpty().withMessage("PIN is required"),
    validateInput,
  ],
  verifyPin
);

// Verify email via verificationToken
router.post(
  "/link/send",
  [body("email").notEmpty().withMessage("Email is required"), validateInput],
  sendVerificationEmail
);

router.get("/link/verify", verifyEmailVerificationToken);

module.exports = router;
