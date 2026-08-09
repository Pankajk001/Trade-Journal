const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  tradeNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // HH:mm format
    required: true,
  },
  pair: {
    type: String,
    required: true,
  },
  market: {
    type: String, // e.g., Forex, Crypto, Stocks
    required: true,
  },
  direction: {
    type: String, // Long, Short
    required: true,
  },
  buySell: {
    type: String, // Buy, Sell
    required: true,
  },
  session: {
    type: String, // London, New York, Asian
    required: true,
    enum: ['London', 'New York', 'Asian', 'Sydney', 'Other']
  },
  setupName: {
    type: String,
    required: true,
  },
  strategyName: {
    type: String,
    required: true,
  },
  entryPrice: {
    type: Number,
    required: true,
  },
  stopLoss: {
    type: Number,
    required: true,
  },
  takeProfit: {
    type: Number,
    required: true,
  },
  riskPercentage: {
    type: Number,
    required: true,
  },
  lotSize: {
    type: Number,
    required: true,
  },
  riskRewardRatio: {
    type: Number,
    required: true,
  },
  exitPrice: {
    type: Number,
    required: true,
  },
  profitLoss: {
    type: Number,
    required: true,
  },
  rMultiple: {
    type: Number,
    required: true,
  },
  winLoss: {
    type: String, // Win, Loss, Breakeven
    required: true,
    enum: ['Win', 'Loss', 'Breakeven']
  },
  emotionsBeforeEntry: {
    type: String,
    required: true,
  },
  confidenceLevel: {
    type: Number, // 1 to 10
    required: true,
    min: 1,
    max: 10
  },
  tradeDescription: {
    type: String,
    required: true,
  },
  mistakesMade: {
    type: String,
    required: true,
  },
  lessonsLearned: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], // Array of tags
    required: true,
  },
  tradeStatus: {
    type: String, // Open, Closed
    required: true,
    enum: ['Open', 'Closed'],
    default: 'Closed'
  },
  screenshotBeforeEntry: {
    type: String, // Cloudinary URL
    required: true,
  },
  screenshotDuringTrade: {
    type: String, // Cloudinary URL
    required: true,
  },
  screenshotAfterExit: {
    type: String, // Cloudinary URL
    required: true,
  },
  tradingViewLink: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
    default: false
  },
}, {
  timestamps: true,
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
