const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    min: 2,
    max: 20,
  },
  uuid: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    min: 2,
  },
  subscription: {
    type: Boolean,
    required: true,
    default: false,
  },
  image: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Class', classSchema);
