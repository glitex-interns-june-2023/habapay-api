const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validateInput } = require("../middlewares/inputValidation");

const { sendMoney, getBalance, depositMoney, withdrawMoney } = require("../controllers/walletController");

router.get("/balance",[
    body("phone").notEmpty().withMessage("Phone number is required"),
    validateInput,
], getBalance);

router.post("/send", sendMoney);
router.post("/deposit", depositMoney);
router.post("/withdraw", withdrawMoney);


module.exports = router;