const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/test';

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('error while establishing database connection', error);
  }
};

module.exports = connectDB;
