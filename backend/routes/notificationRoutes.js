const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/', protect, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      const mockNotifications = [
        {
          _id: 'notif1',
          user: req.user.id,
          title: 'New Assignment Posted',
          message: 'Dr. Sarah Connor posted "Linked List Implementation" in DSA.',
          type: 'assignment',
          isRead: false,
          createdAt: new Date()
        },
        {
          _id: 'notif2',
          user: req.user.id,
          title: 'Google Recruitment Open',
          message: 'Google has opened submissions for SDE Intern (45 LPA). Register now!',
          type: 'placement',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1050)
        },
        {
          _id: 'notif3',
          user: req.user.id,
          title: 'Welcome to Smart Campus',
          message: 'Your email has been verified. Welcome to the DevFusion 4.O Management Platform!',
          type: 'system',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1050)
        }
      ];
      return res.status(200).json({ success: true, notifications: mockNotifications });
    }

    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id }, { isRead: true });
    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
