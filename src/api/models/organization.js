const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  waiting: [{
    user: {
      type: String,
    },
    expire: {
      type: Date,
    },
  }],
});

module.exports = mongoose.model('Organization', organizationSchema);
