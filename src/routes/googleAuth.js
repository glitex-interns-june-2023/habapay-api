const express = require("express");
const router = express.Router();
const { handleGoogleAuth } = require("../controllers/googleAuthController");

router.post("/", handleGoogleAuth);

module.exports = router;