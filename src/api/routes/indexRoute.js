const express = require('express');

const router = express.Router();
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');
const analyticsRoute = require('./analytics.routes');
const announcementRoute = require('./announcement.routes');
const classesRoute = require('./classes.routes');
const chatRoute = require('./chat.routes');
const organizerRoute = require('./organizer.routes');
const user = require('../controllers/userController');
const messageRoute = require('./message.routes');
// const assignmentRoute = require('./assignment.routes');
const subscriptionRoute = require('./subscription.routes');
const questionsRoute = require('./questions.routes');
const { requireSignIn } = require('../middleware');
const { uploadProfileImage } = require('../utils/imageHelper');

router.use('/admin', adminRoute);
// router.use('/assignments', assignmentRoute);
router.use('/analytics', analyticsRoute);
router.use('/announcement', announcementRoute);
router.use('/auth', authRoute);
router.use('/chat', chatRoute);
router.use('/classes', classesRoute);
router.use('/message', messageRoute);
router.use('/organizer', organizerRoute);
router.get('/profile', requireSignIn, user.profile);
router.patch('/profile', requireSignIn, uploadProfileImage.single('avatar'), user.updateProfile);
router.use('/questions', questionsRoute);
router.use('/subscription', subscriptionRoute);

module.exports = router;
