const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    text: { type: String, trim: true },
    image: { type: String, trim: true },
    file: { type: String, trim: true },
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat2',
  },
  readyBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Message2', messageSchema);
