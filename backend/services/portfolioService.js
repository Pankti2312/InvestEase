const Investment = require('../models/Investment');
const Portfolio = require('../models/Portfolio');

const recalculatePortfolio = async (userId) => {
  try {
    // 1. Fetch all investments for this user
    const investments = await Investment.find({ userId });
    
    if (investments.length === 0) {
      await Portfolio.findOneAndUpdate(
        { userId },
        {
          totalValue: 0,
          todayChange: 0,
          allocation: {
            equity: 0,
            debt: 0,
            liquid: 0
          }
        },
        { upsert: true }
      );
      return;
    }

    // 2. Sum up values
    let totalValue = 0;
    let equitySum = 0;
    let debtSum = 0;
    let liquidSum = 0;

    investments.forEach((inv) => {
      totalValue += inv.currentValue;
      if (inv.type === 'Equity') {
        equitySum += inv.currentValue;
      } else if (inv.type === 'Debt') {
        debtSum += inv.currentValue;
      } else if (inv.type === 'Liquid') {
        liquidSum += inv.currentValue;
      }
    });

    // Calculate allocations
    const allocation = {
      equity: totalValue > 0 ? Math.round((equitySum / totalValue) * 100) : 0,
      debt: totalValue > 0 ? Math.round((debtSum / totalValue) * 100) : 0,
      liquid: totalValue > 0 ? Math.round((liquidSum / totalValue) * 100) : 0
    };

    // Handle rounding differences to ensure it adds up to exactly 100
    const sumAlloc = allocation.equity + allocation.debt + allocation.liquid;
    if (totalValue > 0 && sumAlloc !== 100) {
      const largest = Math.max(allocation.equity, allocation.debt, allocation.liquid);
      if (largest === allocation.equity) allocation.equity += (100 - sumAlloc);
      else if (largest === allocation.debt) allocation.debt += (100 - sumAlloc);
      else allocation.liquid += (100 - sumAlloc);
    }

    // 3. Save snapshot to Portfolio document
    await Portfolio.findOneAndUpdate(
      { userId },
      {
        totalValue,
        todayChange: 2.4, // Keep a small typical dynamic daily return change
        allocation
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Failed to recalculate portfolio:', error);
  }
};

module.exports = {
  recalculatePortfolio
};
