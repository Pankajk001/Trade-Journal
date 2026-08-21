const Trade = require('../models/Trade');

// @desc    Create a new trade
// @route   POST /api/trades
// @access  Private
const createTrade = async (req, res, next) => {
  try {
    const tradeData = { ...req.body, user: req.user._id };

    // Handle image uploads if they exist in the request
    if (req.files) {
      if (req.files['screenshotHTF']) {
        tradeData.screenshotHTF = req.files['screenshotHTF'][0].path;
      }
      if (req.files['screenshotMTF']) {
        tradeData.screenshotMTF = req.files['screenshotMTF'][0].path;
      }
      if (req.files['screenshotLTF']) {
        tradeData.screenshotLTF = req.files['screenshotLTF'][0].path;
      }
    }

    const trade = await Trade.create(tradeData);
    res.status(201).json(trade);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Get all trades for logged in user (with pagination, search, filter)
// @route   GET /api/trades
// @access  Private
const getTrades = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    // Build query
    const query = { user: req.user._id };

    // Search by pair or strategy
    if (req.query.keyword) {
      query.$or = [
        { pair: { $regex: req.query.keyword, $options: 'i' } },
        { strategyName: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // Filter by Win/Loss
    if (req.query.winLoss) {
      query.winLoss = req.query.winLoss;
    }

    // Filter by Session
    if (req.query.session) {
      query.session = req.query.session;
    }

    const count = await Trade.countDocuments(query);
    const trades = await Trade.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ trades, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trade statistics
// @route   GET /api/trades/stats
// @access  Private
const getTradeStats = async (req, res, next) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ date: 1 }); // Sort oldest to newest
    
    let totalTrades = trades.length;
    let wins = 0;
    let losses = 0;
    let totalProfit = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    
    // Equity Curve Data (Cumulative PnL)
    let cumulativePnL = 0;
    const equityCurve = trades.map(trade => {
      cumulativePnL += trade.profitLoss;
      return {
        date: trade.date.toISOString().split('T')[0],
        equity: cumulativePnL
      };
    });

    trades.forEach(trade => {
      totalProfit += trade.profitLoss;
      if (trade.winLoss === 'Win') {
        wins += 1;
        grossProfit += trade.profitLoss;
      } else if (trade.winLoss === 'Loss') {
        losses += 1;
        grossLoss += Math.abs(trade.profitLoss);
      }
    });

    const winRate = totalTrades > 0 ? ((wins / (wins + losses)) * 100).toFixed(2) : 0;
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? grossProfit : 0;
    
    // Win/Loss Data for Pie Chart
    const winLossData = [
      { name: 'Wins', value: wins },
      { name: 'Losses', value: losses }
    ];

    res.json({
      totalTrades,
      winRate,
      totalProfit,
      profitFactor,
      equityCurve,
      winLossData,
      recentTrades: trades.slice().reverse().slice(0, 5) // Get last 5 trades
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trade by ID
// @route   GET /api/trades/:id
// @access  Private
const getTradeById = async (req, res, next) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (trade && trade.user.toString() === req.user._id.toString()) {
      res.json(trade);
    } else {
      res.status(404);
      throw new Error('Trade not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a trade
// @route   PUT /api/trades/:id
// @access  Private
const updateTrade = async (req, res, next) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (trade && trade.user.toString() === req.user._id.toString()) {
      const updateData = { ...req.body };

      // Handle image updates
      if (req.files) {
        if (req.files['screenshotHTF']) {
          updateData.screenshotHTF = req.files['screenshotHTF'][0].path;
        }
        if (req.files['screenshotMTF']) {
          updateData.screenshotMTF = req.files['screenshotMTF'][0].path;
        }
        if (req.files['screenshotLTF']) {
          updateData.screenshotLTF = req.files['screenshotLTF'][0].path;
        }
      }

      const updatedTrade = await Trade.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      res.json(updatedTrade);
    } else {
      res.status(404);
      throw new Error('Trade not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a trade
// @route   DELETE /api/trades/:id
// @access  Private
const deleteTrade = async (req, res, next) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (trade && trade.user.toString() === req.user._id.toString()) {
      await trade.deleteOne();
      res.json({ message: 'Trade removed' });
    } else {
      res.status(404);
      throw new Error('Trade not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get public trades for gallery
// @route   GET /api/trades/public
// @access  Public
const getPublicTrades = async (req, res, next) => {
  try {
    const trades = await Trade.find({ isPublic: true })
      .populate('user', 'name') // Populate user to show author name
      .sort({ createdAt: -1 });
    res.json(trades);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrade,
  getTrades,
  getTradeStats,
  getTradeById,
  updateTrade,
  deleteTrade,
  getPublicTrades,
};
