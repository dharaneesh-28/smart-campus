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
      const mockUsers = {
        'admin_mock_id': { id: 'admin_mock_id', name: 'Dharaneesh Admin', email: 'admin@gmail.com', role: 'admin', department: 'CSE' },
        'faculty_mock_id': { id: 'faculty_mock_id', name: 'Dr. Sarah Connor', email: 'faculty@gmail.com', role: 'faculty', department: 'CSE' },
        'coordinator_mock_id': { id: 'coordinator_mock_id', name: 'Alex Coordinator', email: 'coordinator@gmail.com', role: 'coordinator', department: 'IT' },
        'student_mock_id': { id: 'student_mock_id', name: 'John Student Doe', email: 'student@gmail.com', role: 'student', department: 'CSE', semester: 5, rollNumber: 'CSE-2024-042' }
      };
      req.user = mockUsers[decoded.id] || mockUsers['student_mock_id'];
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
