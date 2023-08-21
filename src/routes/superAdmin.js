const express = require("express");
const router = express.Router();
const { createSuperAdmin } = require("../controllers/superAdminController");

router.post("/create", createSuperAdmin);
router.post("/register", createSuperAdmin);

module.exports = router;
