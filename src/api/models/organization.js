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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    expire: {
      type: Date,
      required: true,
    },
  }],
});

module.exports = mongoose.model('Organization', organizationSchema);
