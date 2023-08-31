const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  validateInputs,
  validateInput,
} = require("../middlewares/inputValidation");
const {
  login,
  register,
  sendOTP,
  verifyOTP,
  pinLogin,
  updateLoginPin,
} = require("../controllers/authController");
router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validateInput,
  ],
  login
);

router.post(
  "/register",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validateInputs,
  ],
  register
);

router.post(
  "/send-otp",
  [
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("email").notEmpty().withMessage("Email is required"),
    validateInput,
  ],
  sendOTP
);

router.post(
  "/verify-otp",
  [
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
    validateInput,
  ],
  verifyOTP
);

router.post(
  "/login/pin",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("pin").notEmpty().withMessage("Login PIN is required"),
    validateInput,
  ],
  pinLogin
);

//use this same route to create login pin
router.put(
  "/login/pin",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("pin").notEmpty().withMessage("Login PIN is required"),
    validateInput,
  ],
  updateLoginPin
);
module.exports = router;
