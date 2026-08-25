const Trade = require('../models/Trade');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
    const trade = await Trade.findById(req.params.id).populate('user', 'name');

    if (trade && trade.user._id.toString() === req.user._id.toString()) {
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

// @desc    Parse trade image using Gemini AI
// @route   POST /api/trades/parse-image
// @access  Private
const parseTradeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image provided');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `
      Analyze this trade screenshot. Extract the following information and return strictly as JSON, with no other text or markdown formatting.
      - netPnl (string, e.g. "-$81.35" or "+$50.00")
      - pair (string, e.g. "XAUUSD")
      - direction (string, "Long" or "Short")
      - lotSize (string, e.g. "0.05")
      - entryPrice (string, e.g. "4592.34")
      - exitPrice (string, e.g. "4608.56")
      
      If you cannot find a value, return an empty string for that field.
    `;

    const imageParts = [
      {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from Gemini response (like ```json ... ```)
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    const parsedData = JSON.parse(cleanedText);
    
    res.json(parsedData);
  } catch (error) {
    console.error('Error parsing image:', error);
    res.status(500);
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
  parseTradeImage,
};
