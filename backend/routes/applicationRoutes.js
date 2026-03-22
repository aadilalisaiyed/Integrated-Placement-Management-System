const express = require("express");
const router = express.Router();

const {
  applyToCompany,
  updateApplicationStatus,
  getAllApplications,
  getApplicationById

} = require("../controllers/applicationController");

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

// Public
router.post("/apply/:companyId", applyToCompany);



// Protected list
router.get(
  "/",
  verifyToken,
  authorizeRole("admin", "coordinator"),
  getAllApplications
);
router.get(
  "/:id",
  verifyToken,
  getApplicationById
);
// Protected status update
router.put(
  "/:id",
  verifyToken,
  updateApplicationStatus
);
module.exports = router;
