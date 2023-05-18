const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    min: 2,
    max: 20,
  },
  emailOrPhone: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
    true: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
    trim: true,
  },
  subscriber: {
    type: Boolean,
    required: true,
    default: false,
    trim: true,
  },
});

module.exports = mongoose.model('user', userSchema);
