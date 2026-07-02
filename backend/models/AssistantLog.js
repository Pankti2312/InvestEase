const mongoose = require('mongoose');

const assistantLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueType: { type: String, required: true, enum: ['SIP Failed', 'Statement Missing', 'KYC', 'Nominee', 'General'] },
  resolvedWithoutTicket: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AssistantLog', assistantLogSchema);
