// backend/routes/companyRoutes.js — replace entire file

const express = require('express')
const router  = express.Router()

const {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController')

const { verifyToken, authorizeRole } = require('../middleware/authMiddleware')

// Any logged-in user can view companies (admin, coordinator, student)
router.get('/', verifyToken, getCompanies)

// Only admin and coordinator can create, edit, delete
router.post('/',      verifyToken, authorizeRole('admin', 'coordinator'), createCompany)
router.put('/:id',    verifyToken, authorizeRole('admin', 'coordinator'), updateCompany)
router.delete('/:id', verifyToken, authorizeRole('admin', 'coordinator'), deleteCompany)

module.exports = router