const express = require("express");
const router = express.Router();
const { getUserTransactions } = require("../controllers/transactionController");
const { param } = require("express-validator");
const { validateRouteParam } = require("../middlewares/inputValidation");
const { getUsers } = require("../controllers/userController");
const { getBusinessByUserId, updateUserBusiness } = require("../controllers/businessController");

router.get(
  "/:userId/transactions",
  [
    param("userId").notEmpty().withMessage("User id is a required parameter"),
    validateRouteParam,
  ],
  getUserTransactions
);

router.get("/", getUsers);

router.get("/:userId/business", getBusinessByUserId)
router.put("/:userId/business", updateUserBusiness)

module.exports = router;
