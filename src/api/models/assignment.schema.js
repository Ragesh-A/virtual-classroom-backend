const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
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
  dueDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  image: { type: String },
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  }],
});

module.exports = mongoose.model('Assignments', assignmentSchema);
