const express = require("express");
const router = express.Router();
const {getAnalyticsOverview, getRecentActivity} = require("../controllers/analyticsController");
router.get("/overview", getAnalyticsOverview);
router.get("/activity", getRecentActivity);

module.exports = router;