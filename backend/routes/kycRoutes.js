const express = require('express');
const { 
  uploadKYCDocuments, 
  getKYCStatus, 
  getPendingKYC, 
  updateKYCStatus 
} = require('../controllers/kycController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const User = require('../models/User');

const router = express.Router();

router.post('/upload', protect, upload.fields([
  { name: 'pan', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 }
]), uploadKYCDocuments);

router.get('/status', protect, getKYCStatus);

router.get('/admin/pending', protect, adminOnly, getPendingKYC);
router.put('/admin/:id', protect, adminOnly, updateKYCStatus);

module.exports = router;
