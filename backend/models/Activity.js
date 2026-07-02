const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ['Success', 'Warning', 'Info', 'Error'],
    default: 'Info'
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
