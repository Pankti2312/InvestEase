const KYC = require('../models/KYC');
const User = require('../models/User');

const fileStorage = require('../services/fileStorage');

const uploadKYCDocuments = async (req, res) => {
  try {
    if (!req.files || !req.files.pan || !req.files.aadhaar || !req.files.addressProof) {
      return res.status(400).json({ message: 'All 3 documents are required.' });
    }

    let kycRecord = await KYC.findOne({ userId: req.user._id });

    // Prevent re-upload if already Approved
    if (kycRecord && kycRecord.status === 'Approved') {
      return res.status(400).json({ message: 'KYC is already Approved and cannot be modified.' });
    }

    // Save files through storage service wrapper
    const panPath = await fileStorage.saveFile(req.files.pan[0], 'kyc', req.user._id);
    const aadhaarPath = await fileStorage.saveFile(req.files.aadhaar[0], 'kyc', req.user._id);
    const addressProofPath = await fileStorage.saveFile(req.files.addressProof[0], 'kyc', req.user._id);

    if (kycRecord) {
      kycRecord.panPath = panPath;
      kycRecord.aadhaarPath = aadhaarPath;
      kycRecord.addressProofPath = addressProofPath;
      kycRecord.status = 'Under Review';
      kycRecord.remarks = '';
      kycRecord.rejectionReason = '';
      await kycRecord.save();
    } else {
      kycRecord = await KYC.create({
        userId: req.user._id,
        panPath,
        aadhaarPath,
        addressProofPath,
        status: 'Under Review'
      });
    }

    await User.findByIdAndUpdate(req.user._id, { kycStatus: 'Submitted' });

    res.status(201).json(kycRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getKYCStatus = async (req, res) => {
  try {
    const kycRecord = await KYC.findOne({ userId: req.user._id });
    res.json(kycRecord || { status: 'Pending' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingKYC = async (req, res) => {
  try {
    const pendingKYCs = await KYC.find({ status: 'Under Review' }).populate('userId', 'name email mobile').sort({ createdAt: 1 });
    res.json(pendingKYCs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateKYCStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const kycRecord = await KYC.findById(req.params.id);

    if (!kycRecord) {
      return res.status(404).json({ message: 'KYC record not found' });
    }

    // State machine validation: Only allow transitions from 'Under Review' / 'Pending'
    // and block transitions from final states back to Pending/Under Review
    if (kycRecord.status === 'Approved') {
      return res.status(400).json({ message: 'State Machine Error: Approved KYC cannot be changed.' });
    }
    
    const allowedTargets = ['Approved', 'Rejected'];
    if (!allowedTargets.includes(status)) {
      return res.status(400).json({ message: `State Machine Error: Cannot transition to status: ${status}` });
    }

    kycRecord.status = status;
    kycRecord.remarks = remarks;
    
    // Admin Review Audit fields
    kycRecord.reviewedBy = req.user._id;
    kycRecord.reviewedAt = new Date();
    if (status === 'Rejected') {
      kycRecord.rejectionReason = remarks || 'Documents unclear or verification failed';
    }

    await kycRecord.save();

    let userKycStatus = 'Pending';
    if (status === 'Approved') userKycStatus = 'Approved';
    if (status === 'Rejected') userKycStatus = 'Rejected';

    await User.findByIdAndUpdate(kycRecord.userId, { kycStatus: userKycStatus });

    res.json(kycRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadKYCDocuments,
  getKYCStatus,
  getPendingKYC,
  updateKYCStatus
};
