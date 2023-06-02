const express = require('express');
const { requireSignIn, classIsBlocked } = require('../middlewares');
const classes = require('../controllers/classesController');
const multer = require('../utils/imageHelper');

const router = express.Router();

router.use(requireSignIn);

router.route('/')
  .get(classes.userAllClasses)
  .post(multer.uploadClassBanner.single('image'), multer.classImageResize, classes.createClass);
// .patch(classes.updateClass)

router.route('/join')
  .post(classes.requestToClass)
  .patch(classes.acceptJoinRequest)
  .delete(classes.rejectJoinRequest);

router.use(classIsBlocked);

router.route('/:classId')
  .get(classes.getClass)
  .patch(classes.updateClass);

router.route('/:classId/students')
  .get(classes.students)
  .delete(classes.removeStudent);
// router.route('/:classId/assignments')
//   .get('')
//   .post('');b

module.exports = router;
