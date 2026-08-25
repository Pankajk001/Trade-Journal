const mongoose = require('mongoose');
require('dotenv').config();
const Trade = require('./models/Trade');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found to attach trade to. Please register a user first.');
      process.exit(1);
    }

    const dummyTrade = {
      user: user._id,
      date: new Date(),
      pair: 'BTCUSD',
      market: 'Crypto',
      direction: 'Long',
      buySell: 'Buy',
      session: 'New York',
      duration: '4 hours',
      strategyName: 'Breakout + Retest',
      entryPrice: 65000,
      stopLoss: 64000,
      takeProfit: 68000,
      riskPercentage: 1,
      lotSize: 0.5,
      rMultiple: 3,
      netPnl: 1500,
      profitLoss: 1500,
      winLoss: 'Win',
      emotionsBeforeEntry: 'Calm',
      entryEmotion: 'Confident',
      exitEmotion: 'Satisfied',
      tradeManagement: 'Moved stop loss to breakeven after 1R. Took partials at 2R.',
      tradeDescription: 'Classic breakout of a major resistance level followed by a clean retest on the 15m timeframe. Volume confirmed the breakout.',
      lessonsLearned: 'Patience paid off. Waiting for the retest gave a much better risk/reward ratio than entering on the initial breakout.',
      mistakesMade: '',
      entryConfluences: ['Support/Resistance', 'Volume Spike', 'Moving Average Bounce'],
      isPublic: true,
      followedPlan: true,
      intendedPlan: 'Wait for 15m candle close above resistance, enter on retest with stop below the breakout candle.',
      tags: ['Crypto', 'Breakout', 'TrendFollowing'],
      screenshotHTF: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop' // A random trading chart placeholder
    };

    const trade = await Trade.create(dummyTrade);
    console.log('Dummy trade created successfully!', trade._id);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
