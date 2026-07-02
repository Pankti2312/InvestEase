const SIP = require('../models/SIP');
const Notification = require('../models/Notification');
const { trackEvent } = require('../services/eventService');

const getSIPs = async (req, res) => {
  try {
    const sips = await SIP.find({ userId: req.user._id }).sort({ nextDebit: 1 });
    res.json(sips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateNextDebit = (frequency, lastDebitDate = new Date()) => {
  const nextDate = new Date(lastDebitDate);
  if (frequency === 'Weekly') {
    nextDate.setDate(nextDate.getDate() + 7);
  } else {
    // Default to Monthly
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  return nextDate;
};

const retrySIP = async (req, res) => {
  try {
    const sip = await SIP.findById(req.params.id);

    if (!sip) {
      return res.status(404).json({ message: 'SIP not found' });
    }

    if (sip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this SIP' });
    }

    if (sip.status !== 'Failed') {
      return res.status(400).json({ message: 'Only failed SIPs can be retried' });
    }

    // Simulate successful retry
    sip.status = 'Active';
    sip.failureReason = 'None';
    
    // Dynamically calculate next debit date server-side
    sip.nextDebit = calculateNextDebit(sip.frequency, new Date());

    await sip.save();

    res.json(sip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSIP = async (req, res) => {
  const { fundName, amount, frequency } = req.body;

  if (!fundName || !amount || !frequency) {
    return res.status(400).json({ message: 'All SIP fields are required.' });
  }

  try {
    // Calculate next debit dynamically based on frequency (Weekly / Monthly)
    const nextDebit = calculateNextDebit(frequency, new Date());

    const sip = await SIP.create({
      userId: req.user._id,
      fundName,
      amount: Number(amount),
      frequency,
      status: 'Active',
      nextDebit,
      failureReason: 'None'
    });

    // Track Event (Updates Activity, Notification, clears cache)
    await trackEvent(
      req.user._id,
      'SIP_CREATED',
      'SIP Registered',
      `Your Systematic Investment Plan of ₹${Number(amount).toLocaleString()} for ${fundName} has been successfully registered.`,
      'Success'
    );

    res.status(201).json(sip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSIPs,
  retrySIP,
  createSIP
};
