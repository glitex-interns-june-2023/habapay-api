const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const { validateRouteParams } = require("../middlewares/inputValidation");
const {
  getAdminsWithPagination,
  getAdmin,
  getTransactions,
  approveTransaction,
  getAllUsers,
  getUserActivity,
  getUsersActivity,
  getUser,
  getNewUsers,
  suspendUser,
  unSuspendUser,
  deleteUser,
  updateUser,
} = require("../controllers/adminsController");
const { getTransaction } = require("../controllers/transactionController");

router.get("/", getAdminsWithPagination);
router.get("/transactions", getTransactions);
router.get("/transactions/:transactionId", getTransaction);
router.post("/transactions/:transactionId/approve", approveTransaction);
router.get("/users", getAllUsers);
router.get("/users/new", getNewUsers);
router.get("/users/activity", getUsersActivity)
router.get("/users/:userId", getUser);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);
router.get("/users/:userId/activity", getUserActivity);
router.post("/users/:userId/suspend", suspendUser);
router.post("/users/:userId/unsuspend", unSuspendUser);

router.get(
  "/:adminId",
  [
    param("adminId").notEmpty().withMessage("Admin id is required"),
    validateRouteParams,
  ],
  getAdmin
);

module.exports = router;
