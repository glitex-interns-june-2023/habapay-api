const adminService = require("../services/admins");

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
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdmin = async (req, res, next) => {
  const adminId = req.params.adminId;

  try {
    const admin = await adminService.getAdmin(adminId);
    const data = admin.get({raw: true});
    
    return res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminsWithPagination,
  getAdmin,
};
