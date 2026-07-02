const express = require('express');
const { getPortfolio, buyInvestment } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getPortfolio);
router.post('/invest', protect, buyInvestment);

module.exports = router;
