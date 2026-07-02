const express = require('express');
const { getRequests, createRequest, getAdminRequests, updateRequestStatus } = require('../controllers/supportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getRequests)
  .post(protect, createRequest);

router.get('/admin/tickets', protect, adminOnly, getAdminRequests);
router.put('/admin/tickets/:id', protect, adminOnly, updateRequestStatus);

module.exports = router;
