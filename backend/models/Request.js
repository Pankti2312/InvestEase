const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Completed', 'Rejected', 'Submitted'],
    default: 'Open'
  },
  adminResponse: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
