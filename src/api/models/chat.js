const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  },
  { timestamps: true },
);

chatSchema.index({ users: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Chat2', chatSchema);
