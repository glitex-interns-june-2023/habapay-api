const userService = require("../services/user");
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const users = await userService.getAllUsers(page, perPage);

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
};
