const express = require('express');
const logger = require('morgan');
const connectDB = require('./config/db.config');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const indexRoute = require('./api/routes/indexRoute');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexRoute);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
