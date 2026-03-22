const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const { getAllStudents } = require("../controllers/studentController");

// Admin only
router.get(
  "/",
  verifyToken,
  authorizeRole("admin"),
  getAllStudents
);

module.exports = router;
