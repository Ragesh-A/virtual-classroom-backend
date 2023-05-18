const express = require('express');
const { requireSignIn } = require('../middlewares');
const classes = require('../controllers/classesController');

const router = express.Router();

router.use('/', requireSignIn);
router.get('/', classes.userAllClasses);
module.exports = router;
