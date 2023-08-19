const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validateInput } = require("../middlewares/inputValidation");
const { login, register } = require("../controllers/authController");
router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateInput,
  login
);

router.post("/register", [
    body("email").notEmpty().withMessage("Email is required"),
], validateInput, register);

module.exports = router;
