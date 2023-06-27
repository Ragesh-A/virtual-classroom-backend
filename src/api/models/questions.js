const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['exam', 'quiz'],
      required: true,
      trim: true,
    },
    class: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        trim: true,
      },
    ],
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
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
  },
  { timestamps: true },
);

module.exports = mongoose.model('Questions', questionsSchema);
