const express = require("express");
const router = express.Router();
const { body, query, param } = require("express-validator");
const { validateRouteParams } = require("../middlewares/inputValidation");
const {
  getAdminsWithPagination,
  getAdmin,
  getTransactions,
} = require("../controllers/adminsController");

router.get("/", getAdminsWithPagination);
router.get("/transactions", getTransactions);

router.get(
  "/:adminId",
  [
    param("adminId").notEmpty().withMessage("Admin id is required"),
    validateRouteParams,
  ],
  getAdmin
);


module.exports = router;
