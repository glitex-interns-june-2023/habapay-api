const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validateInput } = require("../middlewares/inputValidation");
const { login, register } = require("../controllers/authController");



module.exports = router;
