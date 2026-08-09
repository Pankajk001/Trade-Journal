const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Price Action', 'Risk Management', 'ICT', 'SMC', 'Psychology', 'Books', 'Videos', 'General'],
      default: 'General',
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    attachmentUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
