const express = require('express');
const { getAdminDashboardData } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getAdminDashboardData);

module.exports = router;
