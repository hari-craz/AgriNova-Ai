const express = require('express');
const router = express.Router();
const { getAnalytics, getDashboardStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAnalytics);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
