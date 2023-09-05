const adminService = require("../services/admins");
const transactionService = require("../services/transactionService");

const getAdminsWithPagination = async (req, res, next) => {
  const { page = 1, perPage = 10 } = req.query;

  try {
    const admins = await adminService.getAdminsWithPagination(page, perPage);

    return res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

const getAdmin = async (req, res, next) => {
  const adminId = req.params.adminId;

  try {
    const admin = await adminService.getAdmin(adminId);
    const data = admin.get({ raw: true });

    return res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  const { status = "pending", page = 1, perPage = 10 } = req.query;
  try {
    const transactions = await transactionService.getAdminTransactions(status, {
      page,
      perPage,
    });
    return res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

const approveTransaction = async (req, res, next) => {
  const { transactionId } = req.params;
  try {
    await transactionService.approveTransaction(transactionId);

    return res.status(200).json({
      success: true,
      message: "Transaction approved successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  const { page = 1, perPage = 10 } = req.query;

  try {
    const users = await adminService.getAllUsers(page, perPage);

    return res.status(200).json({
      success: true,
      message: "All users",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await adminService.getUser(userId);

    return res.status(200).json({
      success: true,
      message: "User",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getUserActivity = async (req, res, next) => {
  const { userId } = req.params;

  const { page = 1, perPage = 10, type } = req.query;
  try {
    const activity = await adminService.getUserActivity(
      userId,
      type,
      page,
      perPage
    );

    return res.status(200).json({
      success: true,
      message: "User activity",
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

const getNewUsers = async (req, res, next) => {
  const { page = 1, perPage = 10 } = req.query;
  try {
    const newUsers = await adminService.getNewUsers(page, perPage);
    return res.status(200).json({
      success: true,
      message: "New users",
      data: newUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminsWithPagination,
  getAdmin,
  getTransactions,
  approveTransaction,
  getAllUsers,
  getUser,
  getUserActivity,
  getNewUsers,
};
