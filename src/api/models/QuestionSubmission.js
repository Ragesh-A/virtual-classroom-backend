const mongoose = require('mongoose');

const questionSubmissionSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questions',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answer: {
    type: Array,
  },
  timeTaken: {
    type: String,
  },
  response: {
    type: String,
  },
  totalScore: { type: Number },
  scoreEarned: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('QuestionSubmissions', questionSubmissionSchema);
