const express = require('express');
const chatController = require('../controllers/chatController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', chatController.register);
router.post('/login', chatController.login);
router.get('/messages', authenticate, chatController.getMessages);
router.post('/messages', authenticate, chatController.sendMessage);

module.exports = router;