const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const SIP = require('../models/SIP');
const Nominee = require('../models/Nominee');
const Notification = require('../models/Notification');
const Request = require('../models/Request');
const { calculateHealthScore } = require('../services/healthScoreService');

const dashboardCache = new Map();

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 10-second TTL Cache lookup
    const cached = dashboardCache.get(userId.toString());
    if (cached && Date.now() - cached.timestamp < 10000) {
      return res.json(cached.data);
    }

    // Run lookups concurrently using Promise.all & lean() for speed
    const [portfolio, sips, user, nominees, unreadNotifications] = await Promise.all([
      Portfolio.findOne({ userId }).lean(),
      SIP.find({ userId }).lean(),
      User.findById(userId).lean(),
      Nominee.find({ userId: req.user._id }).lean(),
      Notification.countDocuments({ userId, read: false })
    ]);

    const portfolioSnapshot = portfolio || { totalValue: 0, todayChange: 0, allocation: { equity: 0, debt: 0, liquid: 0 } };
    const healthScore = calculateHealthScore(req.user, sips, nominees);

    const sipDetails = {
      totalActiveSIPs: sips.filter(s => s.status === 'Active').length,
      totalSIPAmount: sips.filter(s => s.status === 'Active').reduce((sum, sip) => sum + sip.amount, 0),
      nextSIPDate: sips.length > 0 ? sips.sort((a, b) => new Date(a.nextDebit) - new Date(b.nextDebit))[0].nextDebit : null,
      failedSIPs: sips.filter(s => s.status === 'Failed').length
    };

    // Calculate Smart Insights (Urgency Prioritized & Capped at 3)
    const insights = [];

    // 1. SIP Failure (Urgent Error - Priority 1)
    const failedSips = sips.filter(s => s.status === 'Failed');
    if (failedSips.length > 0) {
      insights.push({
        type: 'error',
        title: 'SIP Payment Failed',
        message: 'One or more of your SIPs failed. Please resolve to avoid missing investments.',
        link: '/sip'
      });
    }

    // 2. KYC Missing (Warning - Priority 2)
    if (user.kycStatus !== 'Approved') {
      insights.push({
        type: 'warning',
        title: 'Complete your KYC',
        message: 'Some investor services remain unavailable.',
        link: '/kyc'
      });
    }

    // 3. Nominee Missing (Warning - Priority 3)
    if (nominees.length === 0) {
      insights.push({
        type: 'warning',
        title: 'You haven\'t added a nominee',
        message: 'Protect your investments by adding a beneficiary.',
        link: '/nominee'
      });
    }

    // 4. SIP due soon (Info - Priority 4)
    if (insights.length < 3 && sipDetails.nextSIPDate) {
      const daysToSIP = Math.ceil((new Date(sipDetails.nextSIPDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysToSIP >= 0 && daysToSIP <= 3) {
        insights.push({
          type: 'info',
          title: 'Your SIP is due soon',
          message: `SIP due in ${daysToSIP === 0 ? 'today' : daysToSIP + ' days'}. Maintain sufficient balance.`,
          link: '/sip'
        });
      }
    }

    // 5. Notifications Insight (Info - Priority 5)
    if (insights.length < 3 && unreadNotifications > 0) {
      insights.push({
        type: 'info',
        title: `${unreadNotifications} unread notification${unreadNotifications > 1 ? 's' : ''}`,
        message: 'You have new notifications that require your attention.',
        link: '/notifications'
      });
    }

    // 6. Generic Statement Nudge (Success - Priority 6)
    if (insights.length < 3) {
      insights.push({
        type: 'success',
        title: 'Download this month\'s statement',
        message: 'Keep track of your portfolio growth.',
        link: '/statements'
      });
    }

    const finalInsights = insights.slice(0, 3);

    const recentActivity = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();

    const nextSip = sips.find(s => s.status === 'Active') || null;

    const dashboardData = {
      portfolio: portfolioSnapshot,
      nextSip,
      kycStatus: user.kycStatus,
      healthScore,
      recentActivity,
      insights: finalInsights
    };

    // Store in cache
    dashboardCache.set(userId.toString(), { timestamp: Date.now(), data: dashboardData });

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };
