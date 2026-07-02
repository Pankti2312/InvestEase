const Portfolio = require('../models/Portfolio');
const Investment = require('../models/Investment');

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

module.exports = { getPortfolio };
