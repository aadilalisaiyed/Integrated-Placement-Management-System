// backend/routes/applicationRoutes.js — final version

const express = require('express')
const router  = express.Router()

const {
  applyToCompany,
  updateApplicationStatus,
  getAllApplications,
  getApplicationById,
  getMyApplications,
} = require('../controllers/applicationController')

const { verifyToken, authorizeRole } = require('../middleware/authMiddleware')

// Student — apply to a company
router.post('/apply/:companyId', verifyToken, applyToCompany)

// Student — their own applications only
router.get('/mine', verifyToken, authorizeRole('student'), getMyApplications)

// Admin + coordinator — all applications
router.get('/', verifyToken, authorizeRole('admin', 'coordinator'), getAllApplications)

// Single application detail
router.get('/:id', verifyToken, getApplicationById)

// Status update
router.put('/:id', verifyToken, updateApplicationStatus)

module.exports = router