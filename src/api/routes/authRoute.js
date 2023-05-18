const express = require('express');
const auth = require('../controllers/authController');

const router = express.Router();

router.post('/signup', auth.signup);


module.exports = router;
