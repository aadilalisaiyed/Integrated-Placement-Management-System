// backend/routes/applicationRoutes.js — replace entire file

const express = require('express')
const router  = express.Router()

const {
  applyToCompany,
  updateApplicationStatus,
  getAllApplications,
  getApplicationById,
} = require('../controllers/applicationController')

const { verifyToken, authorizeRole } = require('../middleware/authMiddleware')

// Student — login required to apply
router.post('/apply/:companyId', verifyToken, applyToCompany)

// Admin + Coordinator
router.get('/',    verifyToken, authorizeRole('admin', 'coordinator'), getAllApplications)
router.get('/:id', verifyToken, getAllApplications)
router.put('/:id', verifyToken, updateApplicationStatus)

module.exports = router