const express = require('express');
const { requireSignIn } = require('../middlewares');
const classes = require('../controllers/classesController');

const router = express.Router();

router.use(requireSignIn);

router.route('/')
  .get(classes.userAllClasses)
  .post(classes.createClass);

router.route('/join')
  .post(classes.requestToClass)
  .patch(classes.acceptJoinRequest)
  .delete(classes.rejectJoinRequest);

router.route('/:classId')
  .get(classes.getClass)
  .patch(classes.updateClass);

router.route('/:classId/students')
  .get(classes.students)
  .delete(classes.removeStudent);

module.exports = router;
