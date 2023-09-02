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
    body("username").notEmpty().withMessage("Name is required"),
    body("phone").notEmpty().withMessage("Primary phone number is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("businessName").notEmpty().withMessage("Business name is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("loginPin").notEmpty().withMessage("Login PIN is required"),
    validateInputs,
  ],
  register
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
