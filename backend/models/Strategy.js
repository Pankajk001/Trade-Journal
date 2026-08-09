const mongoose = require('mongoose');

const strategySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rules: {
      type: String, // Can be rich text or bullet points stored as string
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Testing', 'Discarded'],
      default: 'Testing',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Strategy', strategySchema);
