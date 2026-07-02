const express = require('express');
const { getAssistantNode, logResolution } = require('../controllers/assistantController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/node/:id', protect, getAssistantNode);
router.post('/log', protect, logResolution);

module.exports = router;
