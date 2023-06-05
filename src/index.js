const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.config');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const indexRoute = require('./api/routes/indexRoute');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use('/api', indexRoute);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'The requested path was not found on the server.' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
