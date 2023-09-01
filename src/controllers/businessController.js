const businessService = require("../services/businessService");

const getBusinessByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const business = await businessService.getBusinessByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Business retrieved successfully",
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserBusiness = async (req, res, next) => {
  const { userId } = req.params;
  const data = req.body;
  try {
    const business = await businessService.updateUserBusiness(userId, data);

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinessByUserId,
  updateUserBusiness,
};
