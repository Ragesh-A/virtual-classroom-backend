const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    trim: true,
  },
  class: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    trim: true,
  }],
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  questions: {
    type: Array,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Questions', questionsSchema);
