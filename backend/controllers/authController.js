const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = 'smartcampus_secret_key_2026_dharaneesh';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// Initialize global mock users list for Offline Demo Mode
global.mockUsersList = global.mockUsersList || [
  { id: 'admin_mock_id', name: 'Dharaneesh Admin', email: 'admin@gmail.com', password: 'admin123', role: 'admin', department: 'CSE' },
  { id: 'faculty_mock_id', name: 'Dr. Sarah Connor', email: 'faculty@gmail.com', password: 'faculty123', role: 'faculty', department: 'CSE' },
  { id: 'coordinator_mock_id', name: 'Alex Coordinator', email: 'coordinator@gmail.com', password: 'coordinator123', role: 'coordinator', department: 'IT' },
  { id: 'student_mock_id', name: 'John Student Doe', email: 'student@gmail.com', password: 'student123', role: 'student', department: 'CSE', semester: 5, rollNumber: 'CSE-2024-042' }
];

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Database Offline Fallback
    if (mongoose.connection.readyState === 0) {
      console.warn('⚠️ Mongoose disconnected. Using mock registration fallback.');
      const existing = global.mockUsersList.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const newUser = { 
        id: 'mock_' + Date.now(), 
        name, 
        email, 
        password, // stored in plain text for simple local check
        role: role || 'student', 
        department: 'CSE',
        semester: 5,
        rollNumber: 'MOCK-ROLL-' + Math.floor(Math.random() * 1000)
      };
      global.mockUsersList.push(newUser);
      const token = generateToken(newUser.id);
      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return res.status(201).json({
        success: true,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        token
      });
    }

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

    // Database Offline Fallback
    if (mongoose.connection.readyState === 0) {
      console.warn('⚠️ Mongoose disconnected. Using mock credential login fallback.');
      const matched = global.mockUsersList.find(u => u.email === email && u.password === password);
      if (matched) {
        const token = generateToken(matched.id);
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
          success: true,
          user: { id: matched.id, name: matched.name, email: matched.email, role: matched.role },
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
    // Database Offline Fallback
    if (mongoose.connection.readyState === 0) {
      const matched = global.mockUsersList.find(u => u.id === req.user.id);
      return res.status(200).json({ success: true, user: matched || req.user });
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
    // Database Offline Fallback
    if (mongoose.connection.readyState === 0) {
      return res.status(200).json({ success: true, users: global.mockUsersList });
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
    
    // Database Offline Fallback
    if (mongoose.connection.readyState === 0) {
      console.warn('⚠️ Mongoose disconnected. Saving profile changes in-memory.');
      const userIdx = global.mockUsersList.findIndex(u => u.id === req.user.id);
      if (userIdx > -1) {
        global.mockUsersList[userIdx] = {
          ...global.mockUsersList[userIdx],
          name, phone, department, rollNumber, semester, skills, linkedin, github, bio
        };
        return res.status(200).json({ success: true, user: global.mockUsersList[userIdx] });
      }
      return res.status(404).json({ message: 'User not found in mock cache' });
    }

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
