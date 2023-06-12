const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: Boolean,
        default: false,
      },

    },
  ],
  createdAt: { type: String },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
