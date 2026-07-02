const User = require('../models/User');
const KYC = require('../models/KYC');
const Request = require('../models/Request');
const SIP = require('../models/SIP');
const Investment = require('../models/Investment');

const getAdminDashboardData = async (req, res) => {
  try {
    // Aggregation for Total Investments
    const investmentAgg = await Investment.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalInvestments = investmentAgg.length > 0 ? investmentAgg[0].totalAmount : 0;

    // Run lookups concurrently
    const [
      totalInvestors,
      totalAdmins,
      pendingKycCount,
      pendingTicketsCount,
      activeSipsCount,
      recentRegistrations,
      latestKyc,
      latestSupport,
      recentInvestments
    ] = await Promise.all([
      User.countDocuments({ role: 'investor' }),
      User.countDocuments({ role: 'admin' }),
      KYC.countDocuments({ status: 'Pending' }),
      Request.countDocuments({ status: 'Open' }),
      SIP.countDocuments({ status: 'Active' }),
      User.find({ role: 'investor' }).sort({ createdAt: -1 }).limit(5).select('name email createdAt').lean(),
      KYC.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').select('status createdAt').lean(),
      Request.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').select('subject status createdAt').lean(),
      Investment.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').select('fundName amount createdAt').lean()
    ]);

    const dashboardData = {
      metrics: {
        totalInvestors,
        totalAdmins,
        pendingKycCount,
        pendingTicketsCount,
        activeSipsCount,
        totalInvestments
      },
      recentActivity: {
        registrations: recentRegistrations,
        kyc: latestKyc,
        support: latestSupport,
        investments: recentInvestments
      }
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminDashboardData
};
