const Nominee = require('../models/Nominee');
const { trackEvent } = require('../services/eventService');

const getNominees = async (req, res) => {
  try {
    const nominees = await Nominee.find({ userId: req.user._id });
    res.json(nominees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNominee = async (req, res) => {
  const { name, relationship, dob, mobile, email, share } = req.body;

  // Contact validation patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/; // 10-digit number

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (!phoneRegex.test(mobile)) {
    return res.status(400).json({ message: 'Invalid phone format (must be 10 digits).' });
  }

  try {
    const existingNominees = await Nominee.find({ userId: req.user._id });

    // Enforce max 3 nominees per user
    if (existingNominees.length >= 3) {
      return res.status(400).json({ message: 'Maximum of 3 nominees can be added per account.' });
    }

    const currentTotalShare = existingNominees.reduce((sum, nom) => sum + nom.share, 0);

    if (currentTotalShare + Number(share) > 100) {
      return res.status(400).json({ 
        message: `Total share cannot exceed 100%. You can add a maximum of ${100 - currentTotalShare}%` 
      });
    }

    const nominee = await Nominee.create({
      userId: req.user._id,
      name,
      relationship,
      dob,
      mobile,
      email,
      share
    });

    await trackEvent(
      req.user._id,
      'NOMINEE_ADDED',
      'Nominee Added',
      `You successfully added ${name} as a nominee.`,
      'Success'
    );

    res.status(201).json(nominee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNominee = async (req, res) => {
  const { name, relationship, dob, mobile, email, share } = req.body;

  // Contact validation patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/; // 10-digit number

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (!phoneRegex.test(mobile)) {
    return res.status(400).json({ message: 'Invalid phone format (must be 10 digits).' });
  }

  try {
    const existingNominees = await Nominee.find({ userId: req.user._id });
    
    // Calculate total share excluding the one being updated
    const otherNomineesShare = existingNominees
      .filter(nom => nom._id.toString() !== req.params.id)
      .reduce((sum, nom) => sum + nom.share, 0);

    if (otherNomineesShare + Number(share) > 100) {
      return res.status(400).json({ 
        message: `Total share cannot exceed 100%. Maximum allowed is ${100 - otherNomineesShare}%` 
      });
    }

    const updatedNominee = await Nominee.findByIdAndUpdate(
      req.params.id,
      { name, relationship, dob, mobile, email, share },
      { new: true, runValidators: true }
    );

    if (!updatedNominee) {
      return res.status(404).json({ message: 'Nominee not found' });
    }

    res.json(updatedNominee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNominee = async (req, res) => {
  try {
    const nominee = await Nominee.findById(req.params.id);

    if (!nominee) {
      return res.status(404).json({ message: 'Nominee not found' });
    }

    if (nominee.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this nominee' });
    }

    await Nominee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nominee removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNominees,
  createNominee,
  updateNominee,
  deleteNominee
};
