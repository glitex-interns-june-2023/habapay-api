const analyticsService = require("../services/analyticsService");

const getAnalyticsOverview = async (req, res, next) => {
  const analyticsOverview = await analyticsService.getOverview();

  return res.status(200).json({
    success: true,
    message: "Analytics retrieved successfully",
    data: analyticsOverview,
  });
};

module.exports = {
  getAnalyticsOverview,
};
