const express = require('express');

const router = express.Router();
const authRoute = require('./authRoute');
const classesRoute = require('./classesRoute');
const user = require('../services/user');
const { requireSignIn } = require('../middlewares');

router.use('/auth', authRoute);
router.use('/classes', classesRoute);
router.get('/profile', requireSignIn, user.profile);

module.exports = router;
