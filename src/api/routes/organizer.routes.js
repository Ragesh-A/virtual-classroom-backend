const express = require('express');
const { requireSignIn, isSubscriber } = require('../middlewares');
const classes = require('../controllers/classesController');

const router = express.Router();

router.use(requireSignIn);
router.use(isSubscriber);
router.get('/classes', classes.allCreatedClasses);

module.exports = router;
