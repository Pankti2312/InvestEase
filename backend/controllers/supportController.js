const Request = require('../models/Request');

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRequest = async (req, res) => {
  const { subject, message } = req.body;
  try {
    const request = await Request.create({
      userId: req.user._id,
      subject,
      message
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('userId', 'name email').sort({ createdAt: 1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  const { status, adminResponse } = req.body;
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = status;
    if (adminResponse) {
      request.adminResponse = adminResponse;
    }
    
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRequests,
  createRequest,
  getAdminRequests,
  updateRequestStatus
};
