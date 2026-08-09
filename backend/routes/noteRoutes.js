const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Define fields for multer (for attachments)
const cpUpload = upload.fields([
  { name: 'attachment', maxCount: 1 }
]);

router.route('/')
  .get(protect, getNotes)
  .post(protect, cpUpload, createNote);

router.route('/:id')
  .put(protect, cpUpload, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
