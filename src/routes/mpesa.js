const express = require("express");
const router = express.Router();
const mpesaController = require("../controllers/mpesaController");

router.post("/stkpush", mpesaController.sendStkPush);
router.post("confirm-payments/:id", mpesaController.confirmPayment);

module.exports = router;