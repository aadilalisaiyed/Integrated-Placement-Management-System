const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const { getAnalytics } = require("../controllers/dashboardController");

router.get(
  "/analytics",
  verifyToken,
  authorizeRole("admin", "coordinator"),
  getAnalytics
);

module.exports = router;
