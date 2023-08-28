const express = require("express");
const router = express.Router();
const mpesaController = require("../controllers/mpesaController");
const { generateAccessToken } = require("../middlewares/mpesaAcessToken");

router.post("/stkpush", generateAccessToken, mpesaController.sendStkPush);
router.post("confirm-payments/:id", mpesaController.confirmPayment);

module.exports = router;