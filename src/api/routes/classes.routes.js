const express = require('express');
const { requireSignIn, classIsBlocked } = require('../middleware');
const classes = require('../controllers/classesController');
const multer = require('../utils/imageHelper');
const assignmentRoute = require('./assignment.routes');
const attendanceRoute = require('./attendance.routes');
const chatRoute = require('./chat.routes');

const router = express.Router();

router.use(requireSignIn);

router
  .route('/')
  .get(classes.userAllClasses)
  .post(
    multer.uploadClassBanner.single('image'),
    multer.classImageResize,
    classes.createClass,
  );
// .patch(classes.updateClass)

router.get('/as-student', classes.asStudentClasses);

router
  .route('/join')
  .post(classes.requestToClass)
  .patch(classes.acceptJoinRequest)
  .delete(classes.rejectJoinRequest);

router
  .route('/:classId')
  .get(classIsBlocked, classes.getClass)
  .patch(classIsBlocked, classes.updateClass);

router
  .route('/:classId/students')
  .get(classIsBlocked, classes.students)
  .delete(classIsBlocked, classes.removeStudent);

router.use('/:classId/assignments', assignmentRoute);
router.use('/:classId/attendance', attendanceRoute);
router.use('/:classId/chat', chatRoute);

module.exports = router;
