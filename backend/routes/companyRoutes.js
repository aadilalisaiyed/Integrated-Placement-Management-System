// backend/routes/companyRoutes.js

const express = require('express')
const router  = express.Router()

const {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController')

const { verifyToken, authorizeRole } = require('../middleware/authMiddleware')

const guard = [verifyToken, authorizeRole('admin', 'coordinator')]

router.get('/',      ...guard, getCompanies)
router.post('/',     ...guard, createCompany)
router.put('/:id',   ...guard, updateCompany)
router.delete('/:id',...guard, deleteCompany)

module.exports = router