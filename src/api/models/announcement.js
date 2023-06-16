const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    min: 5,
    max: 10,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    min: 5,
  },
  icon: {
    type: String,
    trim: true,
    required: true,
  },
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  announceAt: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    trim: true,
    required: true,
  },
  action: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Announcement', announcementSchema);
