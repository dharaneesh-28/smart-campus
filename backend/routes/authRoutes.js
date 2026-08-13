const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
