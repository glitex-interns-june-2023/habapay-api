const express = require("express");
const router = express.Router();
const { body,query } = require("express-validator");
const { validateInput, validateInputs, validateQueryParam } = require("../middlewares/inputValidation");

const { sendMoney, getBalance, depositMoney, withdrawMoney, confirmDetails } = require("../controllers/walletController");

router.get("/balance",[
    query("phone").notEmpty().withMessage("Phone number is required"),
    validateQueryParam,
], getBalance);

router.get("/confirm-details", [
    query("phone").notEmpty().withMessage("Phone number is required"),
    validateQueryParam,
], confirmDetails);

router.post("/send-money",[
    body("senderPhone").notEmpty().withMessage("Sender phone is required"),
    body("receiverPhone").notEmpty().withMessage("Receiver phone is required"),
    body("amount").notEmpty().withMessage("Amount is required"),
    validateInputs
], sendMoney);

router.post("/deposit", depositMoney);
router.post("/withdraw", withdrawMoney);

module.exports = router;