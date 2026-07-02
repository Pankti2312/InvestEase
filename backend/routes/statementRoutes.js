const express = require('express');
const { getStatements, generateStatement, downloadStatement } = require('../controllers/statementController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getStatements);

router.post('/generate', protect, generateStatement);
router.get('/download/:id', protect, downloadStatement);

module.exports = router;
