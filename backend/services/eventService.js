const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const { clearDashboardCache } = require('../controllers/dashboardController');

/**
 * Tracks an event by creating an Activity, a Notification, and clearing the dashboard cache.
 * @param {string} userId - The user's ID
 * @param {string} action - The programmatic action name (e.g., 'INVESTMENT_ADDED')
 * @param {string} title - The user-friendly title
 * @param {string} message - Detailed description
 * @param {string} type - 'Success', 'Warning', 'Info', 'Error', etc.
 */
const trackEvent = async (userId, action, title, message, type = 'Info') => {
  try {
    // 1. Log Activity
    await Activity.create({
      userId,
      action,
      title,
      message,
      type
    });

    // 2. Create Notification (map types slightly if Notification expects different enums, 
    // but both support 'Success', 'Info'. Let's ensure it matches Notification schema)
    const validNotificationTypes = ['Action', 'Reminder', 'Success', 'Info', 'Alert'];
    const notifType = validNotificationTypes.includes(type) ? type : 'Info';
    
    await Notification.create({
      userId,
      title,
      message,
      type: notifType
    });

    // 3. Invalidate Dashboard Cache
    clearDashboardCache(userId);

  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

module.exports = { trackEvent };
