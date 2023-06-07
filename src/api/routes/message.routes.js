const express = require('express');
const controller = require('../controllers/messageController');
const { requireSignIn } = require('../middleware');

const router = express.Router();

router.use(requireSignIn);
router.post('/', controller.sendMessage);
router.get('/:chatId', controller.getMessage);

module.exports = router;
