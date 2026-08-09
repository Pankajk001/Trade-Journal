const express = require('express');
const router = express.Router();
const {
  getMistakes,
  createMistake,
  updateMistake,
  deleteMistake,
} = require('../controllers/mistakeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMistakes)
  .post(protect, createMistake);

router.route('/:id')
  .put(protect, updateMistake)
  .delete(protect, deleteMistake);

module.exports = router;
