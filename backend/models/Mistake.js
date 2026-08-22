const mongoose = require('mongoose');

const mistakeSchema = mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    impact: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    howToAvoid: {
      type: String,
      required: true,
    },
    frequency: {
      type: Number,
      default: 0, // Gets incremented every time a trade is tagged with this mistake
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mistake', mistakeSchema);
