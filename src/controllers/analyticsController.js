const analyticsService = require("../services/analyticsService");

const getAnalyticsOverview = async (req, res, next) => {
  try {
    const analyticsOverview = await analyticsService.getOverview();

    return res.status(200).json({
      success: true,
      message: "Analytics retrieved successfully",
      data: analyticsOverview,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  const { page = 1, perPage = 10 } = req.query;
  try {
    const recentActivity = await analyticsService.getRecentActivity(
      page,
      perPage
    );

    return res.status(200).json({
      success: true,
      message: "Recent activity retrieved successfully",
      data: recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsOverview,
  getRecentActivity,
};
