const express = require('express');

const router = express.Router();
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');
const classesRoute = require('./classesRoute');
const organizerRoute = require('./organizer.routes');
const user = require('../controllers/userController');
const { requireSignIn } = require('../middlewares');

router.use('/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/classes', classesRoute);
router.use('/organizer', organizerRoute);
router.get('/profile', requireSignIn, user.profile);

module.exports = router;
