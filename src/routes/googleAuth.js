const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validateInput } = require("../middlewares/inputValidation");

const { handleGoogleAuth } = require("../controllers/googleAuthController");

router.post(
  "/",
  [
    body("token").notEmpty().withMessage("Google token is required"),
    validateInput,
  ],
  handleGoogleAuth
);

module.exports = router;
