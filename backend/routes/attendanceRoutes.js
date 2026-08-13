const express = require('express');
const router = express.Router();
const { createSession, getByCourse, getStudentAttendance, getAllAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/session', protect, authorize('faculty', 'admin'), createSession);
router.get('/course/:course', protect, getByCourse);
router.get('/student/:studentId', protect, getStudentAttendance);
router.get('/all', protect, authorize('admin'), getAllAttendance);

module.exports = router;
