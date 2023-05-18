const express = require('express');

const router = express.Router();
const authRoute = require('./authRoute');
const classesRoute = require('./classesRoute');

router.use('/auth', authRoute);
router.use('/classes', classesRoute);

module.exports = router;
