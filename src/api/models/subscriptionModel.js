const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    amount: { type: Number },
    paymentIntent: { type: String },
    plan: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
