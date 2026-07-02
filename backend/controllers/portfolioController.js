const Portfolio = require('../models/Portfolio');
const Investment = require('../models/Investment');
const Notification = require('../models/Notification');
const { recalculatePortfolio } = require('../services/portfolioService');
const { clearDashboardCache } = require('./dashboardController');

const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id });
    let investments = await Investment.find({ userId: req.user._id });
    
    if (!portfolio) {
      if (req.user.role === 'admin') {
        portfolio = {
          totalValue: 1250000,
          todayChange: 15400,
          allocation: {
            equity: 50,
            debt: 30,
            liquid: 20
          }
        };
        investments = [
          { _id: 'mock1', fundName: 'Admin Axis Bluechip Fund', type: 'Equity', amount: 500000, units: 500, currentValue: 625000 },
          { _id: 'mock2', fundName: 'Admin SBI Debt Fund', type: 'Debt', amount: 375000, units: 375, currentValue: 375000 },
          { _id: 'mock3', fundName: 'Admin HDFC Liquid Fund', type: 'Liquid', amount: 250000, units: 250, currentValue: 250000 }
        ];
      } else {
        // Return default empty portfolio for new users instead of a 404 error
        portfolio = {
          totalValue: 0,
          todayChange: 0,
          allocation: {
            equity: 0,
            debt: 0,
            liquid: 0
          }
        };
        investments = [];
      }
    }
    
    res.json({ portfolio, investments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buyInvestment = async (req, res) => {
  const { fundName, type, amount, nav } = req.body;
  
  if (!fundName || !type || !amount || !nav) {
    return res.status(400).json({ message: 'All investment fields are required.' });
  }

  try {
    const units = Number(amount) / Number(nav);
    
    // Create new investment
    const investment = await Investment.create({
      userId: req.user._id,
      fundName,
      type,
      amount: Number(amount),
      units: Number(units),
      currentValue: Number(amount) // Initial value matches investment amount
    });

    // 1. Recalculate portfolio snapshot (Event Chain Module 3/4)
    await recalculatePortfolio(req.user._id);

    // Evict cache
    clearDashboardCache(req.user._id);

    // 2. Create notification event (Event Chain Module 5)
    await Notification.create({
      userId: req.user._id,
      title: 'Investment Successful',
      message: `You successfully invested ₹${Number(amount).toLocaleString()} in ${fundName} (${units.toFixed(2)} units).`,
      type: 'Success',
      read: false
    });

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getPortfolio,
  buyInvestment
};
