const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  tradeNumber: { type: String },
  date: { type: Date },
  time: { type: String }, // HH:mm format
  pair: { type: String },
  market: { type: String }, // e.g., Forex, Crypto, Stocks
  direction: { type: String }, // Long, Short
  buySell: { type: String }, // Buy, Sell
  session: { type: String },
  setupName: { type: String },
  strategyName: { type: String },
  entryPrice: { type: Number },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  riskPercentage: { type: Number },
  lotSize: { type: Number },
  riskRewardRatio: { type: Number },
  exitPrice: { type: Number },
  profitLoss: { type: Number },
  rMultiple: { type: Number },
  winLoss: { type: String }, // Win, Loss, Breakeven
  emotionsBeforeEntry: { type: String },
  confidenceLevel: { type: Number }, // 1 to 10
  tradeDescription: { type: String },
  mistakesMade: { type: String },
  lessonsLearned: { type: String },
  tags: { type: [String] }, // Array of tags
  tradeStatus: {
    type: String, // Open, Closed
    enum: ['Open', 'Closed'],
    default: 'Closed'
  },
  screenshotHTF: { type: String },
  screenshotMTF: { type: String },
  screenshotLTF: { type: String },
  tradingViewLink: { type: String },
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // New Review & Reflection fields
  followedPlan: { type: Boolean, default: false },
  intendedPlan: { type: String },
  tradeManagement: { type: String },
  entryEmotion: { type: String },
  exitEmotion: { type: String }
  
}, {
  timestamps: true,
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
