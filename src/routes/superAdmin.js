const express = require("express");
const router = express.Router();
const { createSuperAdmin } = require("../controllers/superAdminController");

router.post("/create", createSuperAdmin);

module.exports = router;
