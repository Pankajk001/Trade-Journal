const express = require('express');
const router = express.Router();
const {
  createTrade,
  getTrades,
  getTradeStats,
  getTradeById,
  updateTrade,
  deleteTrade,
  getPublicTrades
} = require('../controllers/tradeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Define fields for multer
const cpUpload = upload.fields([
  { name: 'screenshotBeforeEntry', maxCount: 1 },
  { name: 'screenshotDuringTrade', maxCount: 1 },
  { name: 'screenshotAfterExit', maxCount: 1 }
]);

// Public route (must be before /:id so 'public' isn't treated as an ID)
router.route('/public').get(getPublicTrades);

router.route('/')
  .post(protect, cpUpload, createTrade)
  .get(protect, getTrades);

router.route('/stats')
  .get(protect, getTradeStats);

router.route('/:id')
  .get(protect, getTradeById)
  .put(protect, cpUpload, updateTrade)
  .delete(protect, deleteTrade);

module.exports = router;
