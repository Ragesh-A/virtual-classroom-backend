const router = require('express').Router({ mergeParams: true });
const controller = require('../controllers/attendanceController');

router.route('/')
  .get(controller.todayAttendance)
  .post(controller.createAttendance);
//   .patch(controller.updateAttendance);

module.exports = router;
