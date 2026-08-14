const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'smartcampus_secret_key_2026_dharaneesh';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      console.warn('⚠️ Mongoose disconnected. Using mock credential fallback.');
      const mockRoles = {
        'admin@gmail.com': { id: 'admin_mock_id', name: 'Dharaneesh Admin', role: 'admin', pw: 'admin123' },
        'faculty@gmail.com': { id: 'faculty_mock_id', name: 'Dr. Sarah Connor', role: 'faculty', pw: 'faculty123' },
        'coordinator@gmail.com': { id: 'coordinator_mock_id', name: 'Alex Coordinator', role: 'coordinator', pw: 'coordinator123' },
        'student@gmail.com': { id: 'student_mock_id', name: 'John Student Doe', role: 'student', pw: 'student123' }
      };

      const matched = mockRoles[email];
      if (matched && matched.pw === password) {
        const token = generateToken(matched.id);
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
          success: true,
          user: { id: matched.id, name: matched.name, email, role: matched.role },
          token
        });
      }
      return res.status(401).json({ message: 'Invalid credentials. Try student@gmail.com / student123' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      return res.status(200).json({ success: true, user: req.user });
    }

    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Get All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      const mockList = [
        { id: 'admin_mock_id', name: 'Dharaneesh Admin', email: 'admin@gmail.com', role: 'admin', department: 'CSE' },
        { id: 'faculty_mock_id', name: 'Dr. Sarah Connor', email: 'faculty@gmail.com', role: 'faculty', department: 'CSE' },
        { id: 'coordinator_mock_id', name: 'Alex Coordinator', email: 'coordinator@gmail.com', role: 'coordinator', department: 'IT' },
        { id: 'student_mock_id', name: 'John Student Doe', email: 'student@gmail.com', role: 'student', department: 'CSE', semester: 5, rollNumber: 'CSE-2024-042' }
      ];
      return res.status(200).json({ success: true, users: mockList });
    }

    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, department, rollNumber, semester, skills, linkedin, github, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, department, rollNumber, semester, skills, linkedin, github, bio },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
