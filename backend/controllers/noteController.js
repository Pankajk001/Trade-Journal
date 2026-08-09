const Note = require('../models/Note');

// @desc    Get user's notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    // Optional filtering by category
    const query = { user: req.user._id };
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    const notes = await Note.find(query).sort({ createdAt: -1 }); // Newest first
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, category, content, tags } = req.body;
    let attachmentUrl = '';

    if (req.files && req.files['attachment'] && req.files['attachment'][0]) {
      attachmentUrl = req.files['attachment'][0].path;
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      category,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      attachmentUrl,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    if (note.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }
    
    const updateData = { ...req.body };
    if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    if (req.files && req.files['attachment'] && req.files['attachment'][0]) {
      updateData.attachmentUrl = req.files['attachment'][0].path;
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    if (note.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
