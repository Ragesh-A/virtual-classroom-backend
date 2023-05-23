const express = require('express');
const { requireSignIn } = require('../middlewares');
const classes = require('../controllers/classesController');

const router = express.Router();

router.use(requireSignIn);
router.route('/').get(classes.userAllClasses).post(classes.createClass);
router.post('/join', classes.joinClass);
router.route('/:classId').get(classes.getClass).patch(classes.updateClass);
module.exports = router;
