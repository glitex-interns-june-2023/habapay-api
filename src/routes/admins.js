const express = require("express");
const router = express.Router();
const { body, query, param } = require("express-validator");
const { validateRouteParams } = require("../middlewares/inputValidation");
const {
  getAdminsWithPagination,
  getAdmin,
  getTransactions,
  approveTransaction,
} = require("../controllers/adminsController");
const { getTransaction } = require("../controllers/transactionController");

router.get("/", getAdminsWithPagination);
router.get("/transactions", getTransactions);
router.get("/transactions/:transactionId", getTransaction);
router.post("/transactions/:transactionId/approve", approveTransaction);
router.get(
  "/:adminId",
  [
    param("adminId").notEmpty().withMessage("Admin id is required"),
    validateRouteParams,
  ],
  getAdmin
);

module.exports = router;
