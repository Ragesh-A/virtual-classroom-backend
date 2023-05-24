const mongoose = require('mongoose');

const classWaitingListSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  waiting: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
});

module.exports = mongoose.model('classWaitingList', classWaitingListSchema);
