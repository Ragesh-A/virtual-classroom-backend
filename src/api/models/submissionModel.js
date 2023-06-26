const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignments',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answer: {
    type: String,
  },
  image: [{
    type: String,
  }],
  timeTaken: {
    type: String,
  },
  accepted: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  response: {
    type: String,
  },
  totalScore: { type: Number },
  scoreEarned: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Submissions', submissionSchema);
