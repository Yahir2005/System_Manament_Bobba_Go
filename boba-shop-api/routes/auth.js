const express = require('express');
const router = express.Router();
const authController = require('../src/controller/authController');
const { verifyToken } = require('../src/middleware/authMiddleware');

router.post('/login', authController.login);
router.get('/me', verifyToken, authController.me);
router.get('/users', verifyToken, authController.getAllUsers);

module.exports = router;
