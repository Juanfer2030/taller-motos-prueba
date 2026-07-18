const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.post('/login', login);
router.post('/register', authMiddleware, requireRole('ADMIN'), register);

module.exports = router;