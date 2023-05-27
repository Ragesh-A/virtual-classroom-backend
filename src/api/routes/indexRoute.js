const express = require('express');

const router = express.Router();
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');
const classesRoute = require('./classesRoute');
const organizerRoute = require('./organizer.routes');
const user = require('../controllers/userController');
const subscriptionRoute = require('./subscription.routes');
const { requireSignIn } = require('../middlewares');

router.use('/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/classes', classesRoute);
router.use('/organizer', organizerRoute);
router.use('/subscription', subscriptionRoute);
router.get('/profile', requireSignIn, user.profile);

module.exports = router;
