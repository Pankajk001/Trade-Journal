const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trade = require('./models/Trade');
const User = require('./models/User');
const Mistake = require('./models/Mistake');
const Strategy = require('./models/Strategy');
const Note = require('./models/Note');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const generateDummyTrades = (userId) => {
  const trades = [];
  const pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD', 'ETHUSD', 'US30', 'NAS100'];
  const directions = ['Long', 'Short'];
  const sessions = ['London', 'New York', 'Asia', 'Sydney'];
  const winLosses = ['Win', 'Loss', 'Breakeven'];
  const strategies = ['Breakout', 'Trend Following', 'Mean Reversion'];
  const emotions = ['FOMO', 'Revenge Trading', 'Patient', 'Calm', 'Fearful', 'Greedy', 'Overconfident', 'Neutral'];
  
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 30); // Start 30 days ago

  for (let i = 1; i <= 20; i++) {
    // Generate dates progressing forward
    currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 2) + 1);
    if (currentDate > new Date()) currentDate = new Date(); // Don't go into future
    
    const winLoss = winLosses[Math.floor(Math.random() * winLosses.length)];
    const netPnl = winLoss === 'Win' ? Math.floor(Math.random() * 500) + 100 : winLoss === 'Loss' ? -(Math.floor(Math.random() * 200) + 50) : 0;
    const rMultiple = winLoss === 'Win' ? (Math.random() * 2 + 1).toFixed(2) : winLoss === 'Loss' ? -1 : 0;
    
    const followedPlan = Math.random() > 0.3;

    trades.push({
      user: userId,
      tradeNumber: `TRD-${1000 + i}`,
      date: new Date(currentDate),
      time: '09:30',
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      market: 'Forex',
      direction: directions[Math.floor(Math.random() * directions.length)],
      session: sessions[Math.floor(Math.random() * sessions.length)],
      duration: `${Math.floor(Math.random() * 4) + 1} hrs`,
      strategyName: strategies[Math.floor(Math.random() * strategies.length)],
      entryPrice: 1.0500 + Math.random() * 0.05,
      stopLoss: 1.0450 + Math.random() * 0.02,
      takeProfit: 1.0600 + Math.random() * 0.02,
      riskPercentage: 1.5,
      lotSize: 0.5,
      exitPrice: 1.0550 + Math.random() * 0.05,
      netPnl: netPnl,
      profitLoss: netPnl,
      fees: 2.50,
      swap: -0.50,
      rMultiple: parseFloat(rMultiple),
      winLoss: winLoss,
      entryEmotion: emotions[Math.floor(Math.random() * emotions.length)],
      exitEmotion: emotions[Math.floor(Math.random() * emotions.length)],
      tradeManagement: 'Moved SL to BE at 1R',
      noteReflection: 'This is a dummy trade reflecting the new fields. Waited patiently for setup.',
      mistakesMade: winLoss === 'Loss' ? 'Added to Position too early' : 'None',
      lessonsLearned: 'Always wait for the candle to close',
      tags: ['dummy', 'test'],
      tradeStatus: 'Closed',
      screenshotHTF: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      screenshotMTF: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      screenshotLTF: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      tradingViewLink: 'https://www.tradingview.com/',
      isPublic: Math.random() > 0.5,
      followedPlan: followedPlan,
      intendedPlan: followedPlan ? '' : 'I wanted to wait for the 1hr close but got impatient.',
      entryConfluences: ['RSI Divergence', 'Support/Resistance'],
    });
  }
  return trades;
};

const importData = async () => {
  try {
    const user = await User.findOne(); // Get any user, ideally the one you created
    if (!user) {
      console.error('No user found! Please register a user first.');
      process.exit(1);
    }

    // Clear existing data for this user before seeding
    await Trade.deleteMany({ user: user._id });
    await Mistake.deleteMany({ user: user._id });
    await Strategy.deleteMany({ user: user._id });
    await Note.deleteMany({ user: user._id });

    const dummyTrades = generateDummyTrades(user._id);
    await Trade.insertMany(dummyTrades);

    // Dummy Mistakes
    const dummyMistakes = [
      { user: user._id, title: 'FOMO Entry', description: 'Entering a trade because it is moving fast without a setup', impact: 'Usually results in immediate drawdown', solution: 'Wait for a pullback', howToAvoid: 'Set alerts and walk away', frequency: 5 },
      { user: user._id, title: 'Moving Stop Loss', description: 'Widening the stop loss when price gets close', impact: 'Larger losses than planned', solution: 'Accept the loss', howToAvoid: 'Use bracket orders and do not touch them', frequency: 2 },
    ];
    await Mistake.insertMany(dummyMistakes);

    // Dummy Strategies
    const dummyStrategies = [
      { user: user._id, name: 'Breakout', description: 'Trading the breakout of a consolidation zone', entryCriteria: 'Price breaks resistance, Volume confirms breakout', chartingProcess: 'Mark key levels on 4H, wait for 15M breakout.', rules: '1. Identify range. 2. Wait for candle close outside range. 3. Enter on retest.', status: 'Active' },
      { user: user._id, name: 'Trend Following', description: 'Riding the trend using moving averages', entryCriteria: 'Price above 50 EMA, Bullish engulfing on 20 EMA', chartingProcess: 'Determine trend on Daily, execute on 1H pullbacks.', rules: '1. Price above 50 EMA. 2. Pullback to 20 EMA. 3. Bullish engulfing candle.', status: 'Active' },
      { user: user._id, name: 'Mean Reversion', description: 'Fading extreme moves', entryCriteria: 'RSI > 80 or < 20, Price far from VWAP', chartingProcess: 'Identify overextended moves on 5M, look for divergence.', rules: '1. Price far from VWAP. 2. RSI divergence. 3. Reversal pattern.', status: 'Testing' },
    ];
    await Strategy.insertMany(dummyStrategies);

    // Dummy Notes
    const dummyNotes = [
      { user: user._id, title: 'Understanding Market Structure', category: 'Price Action', content: 'Market structure is the foundation of price action. Higher highs and higher lows indicate an uptrend. Lower highs and lower lows indicate a downtrend. Always trade with the structure.', tags: ['basics', 'trend'] },
      { user: user._id, title: 'The Importance of R:R', category: 'Risk Management', content: 'Risk to reward ratio is crucial. A 1:2 R:R means risking $100 to make $200. With a 1:2 R:R, you only need a 33% win rate to break even. Aim for at least 1:2 on every trade.', tags: ['risk', 'math'] },
      { user: user._id, title: 'Dealing with FOMO', category: 'Psychology', content: 'Fear Of Missing Out is a trader\'s worst enemy. It leads to chasing price and entering trades outside of the trading plan. To combat FOMO, remember that the market provides endless opportunities. Missing one trade is better than losing money on a bad setup.', tags: ['mindset', 'discipline'] },
    ];
    await Note.insertMany(dummyNotes);

    console.log('Dummy Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

importData();
