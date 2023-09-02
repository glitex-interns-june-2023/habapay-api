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
  const { status="pending", page = 1, perPage = 10 } = req.query;
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

module.exports = {
  getAdminsWithPagination,
  getAdmin,
  getTransactions
};
