const express = require('express');
const auth = require('../controllers/authController');

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/verify-email', auth.emailVerification);
router.post('/password-reset-request', auth.resetPasswordRequest);
router.post('/verify-otp', auth.verifyOtp);
router.patch('/password', auth.resetPassword);

module.exports = router;
