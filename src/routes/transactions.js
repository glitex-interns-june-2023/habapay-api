const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransaction,
} = require("../controllers/transactionController");

router.get("/", getTransactions);
router.get("/:id", getTransaction);

module.exports = router;
