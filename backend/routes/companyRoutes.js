const express = require("express");
const router = express.Router();
const { createCompany, getCompanies } = require("../controllers/companyController");
const { verifyToken } = require("../middleware/authMiddleware");

// Protected routes
router.post("/", verifyToken, createCompany);
router.get("/", verifyToken, getCompanies);

module.exports = router;
