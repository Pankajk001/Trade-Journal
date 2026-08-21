const Strategy = require('../models/Strategy');
const Trade = require('../models/Trade');

// @desc    Get user's strategies with stats
// @route   GET /api/strategies
// @access  Private
const getStrategies = async (req, res, next) => {
  try {
    const strategies = await Strategy.find({ user: req.user._id });
    const trades = await Trade.find({ user: req.user._id });

    // Calculate stats for each strategy dynamically
    const strategiesWithStats = strategies.map((strategy) => {
      const strategyTrades = trades.filter((t) => t.strategyName === strategy.name);
      
      let wins = 0;
      let totalRR = 0;

      strategyTrades.forEach((trade) => {
        if (trade.winLoss === 'Win') {
          wins++;
        }
        if (trade.rMultiple && !isNaN(trade.rMultiple)) {
          totalRR += trade.rMultiple;
        }
      });

      const totalTrades = strategyTrades.length;
      const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(2) : 0;
      const averageRR = totalTrades > 0 ? (totalRR / totalTrades).toFixed(2) : 0;

      return {
        ...strategy.toObject(),
        stats: {
          totalTrades,
          winRate,
          averageRR,
        },
      };
    });

    res.json(strategiesWithStats);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a strategy
// @route   POST /api/strategies
// @access  Private
const createStrategy = async (req, res, next) => {
  try {
    const { name, description, chartingProcess, entryCriteria, status } = req.body;

    const strategy = await Strategy.create({
      user: req.user._id,
      name,
      description,
      chartingProcess,
      entryCriteria,
      status: status || 'Testing',
    });

    res.status(201).json(strategy);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a strategy
// @route   PUT /api/strategies/:id
// @access  Private
const updateStrategy = async (req, res, next) => {
  try {
    let strategy = await Strategy.findById(req.params.id);

    if (!strategy) {
      res.status(404);
      throw new Error('Strategy not found');
    }

    if (strategy.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    strategy = await Strategy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(strategy);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a strategy
// @route   DELETE /api/strategies/:id
// @access  Private
const deleteStrategy = async (req, res, next) => {
  try {
    const strategy = await Strategy.findById(req.params.id);

    if (!strategy) {
      res.status(404);
      throw new Error('Strategy not found');
    }

    if (strategy.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await strategy.deleteOne();
    res.json({ message: 'Strategy removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
};
