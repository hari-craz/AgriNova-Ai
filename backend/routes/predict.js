const express = require('express');
const router = express.Router();
const { predictCrop, getColdStorageData } = require('../controllers/predictController');
const { protect } = require('../middleware/auth');

router.post('/crop', protect, predictCrop);
router.get('/cold-storage', protect, getColdStorageData);

module.exports = router;
