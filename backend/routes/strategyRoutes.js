const express = require('express');
const router = express.Router();
const {
  getStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
} = require('../controllers/strategyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getStrategies)
  .post(protect, createStrategy);

router.route('/:id')
  .put(protect, updateStrategy)
  .delete(protect, deleteStrategy);

module.exports = router;
