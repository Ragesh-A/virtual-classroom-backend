const router = require('express').Router({ mergeParams: true });
const controller = require('../controllers/attendanceController');

router.route('/')
  .get(controller.todayAttendance)
  .post(controller.createAttendance);

router.route('/class')
  .get(controller.getAttendances);
// .post()
module.exports = router;
