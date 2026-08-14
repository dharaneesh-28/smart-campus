const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'smartcampus_secret_key_2026_dharaneesh';

// Protect routes - verify token
const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      token = parts.length === 2 ? parts[1] : parts[0];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      global.mockUsersList = global.mockUsersList || [
        { id: 'admin_mock_id', name: 'Dharaneesh Admin', email: 'admin@gmail.com', password: 'admin123', role: 'admin', department: 'CSE' },
        { id: 'faculty_mock_id', name: 'Dr. Sarah Connor', email: 'faculty@gmail.com', password: 'faculty123', role: 'faculty', department: 'CSE' },
        { id: 'coordinator_mock_id', name: 'Alex Coordinator', email: 'coordinator@gmail.com', password: 'coordinator123', role: 'coordinator', department: 'IT' },
        { id: 'student_mock_id', name: 'John Student Doe', email: 'student@gmail.com', password: 'student123', role: 'student', department: 'CSE', semester: 5, rollNumber: 'CSE-2024-042' }
      ];
      const matched = global.mockUsersList.find(u => u.id === decoded.id);
      req.user = matched || { id: decoded.id, name: 'Guest User', email: 'guest@college.edu', role: 'student' };
      return next();
    }

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { protect, authorize };
