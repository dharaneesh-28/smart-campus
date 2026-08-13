const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEvent, registerEvent, cancelRegistration, deleteEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('coordinator', 'admin'), createEvent);
router.get('/', protect, getAllEvents);
router.get('/:id', protect, getEvent);
router.post('/:id/register', protect, authorize('student'), registerEvent);
router.post('/:id/cancel', protect, authorize('student'), cancelRegistration);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;
