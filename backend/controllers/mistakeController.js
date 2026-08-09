const Mistake = require('../models/Mistake');

// @desc    Get user's mistakes
// @route   GET /api/mistakes
// @access  Private
const getMistakes = async (req, res, next) => {
  try {
    const mistakes = await Mistake.find({ user: req.user._id }).sort({ frequency: -1 }); // Sort by most frequent
    res.json(mistakes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a mistake
// @route   POST /api/mistakes
// @access  Private
const createMistake = async (req, res, next) => {
  try {
    const { title, description, impact, solution, howToAvoid } = req.body;

    const mistake = await Mistake.create({
      user: req.user._id,
      title,
      description,
      impact,
      solution,
      howToAvoid,
      frequency: 0
    });

    res.status(201).json(mistake);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a mistake
// @route   PUT /api/mistakes/:id
// @access  Private
const updateMistake = async (req, res, next) => {
  try {
    let mistake = await Mistake.findById(req.params.id);

    if (!mistake) {
      res.status(404);
      throw new Error('Mistake not found');
    }

    if (mistake.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    mistake = await Mistake.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(mistake);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a mistake
// @route   DELETE /api/mistakes/:id
// @access  Private
const deleteMistake = async (req, res, next) => {
  try {
    const mistake = await Mistake.findById(req.params.id);

    if (!mistake) {
      res.status(404);
      throw new Error('Mistake not found');
    }

    if (mistake.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await mistake.deleteOne();
    res.json({ message: 'Mistake removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMistakes,
  createMistake,
  updateMistake,
  deleteMistake,
};
