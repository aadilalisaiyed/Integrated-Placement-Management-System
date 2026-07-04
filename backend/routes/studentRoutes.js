// backend/routes/studentRoutes.js

const express = require('express')
const router  = express.Router()

const { verifyToken, authorizeRole } = require('../middleware/authMiddleware')
const { getAllStudents, getMyProfile } = require('../controllers/studentController')

// Admin + coordinator — full list
router.get('/',
  verifyToken,
  authorizeRole('admin', 'coordinator'),
  getAllStudents
)

// Student — their own profile
router.get('/me',
  verifyToken,
  authorizeRole('student'),
  getMyProfile
)

module.exports = router