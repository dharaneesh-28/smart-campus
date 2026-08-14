const Attendance = require('../models/Attendance');

// Create attendance session (Faculty)
exports.createSession = async (req, res) => {
  try {
    const { course, date, students } = req.body;
    const attendance = await Attendance.create({
      course,
      faculty: req.user.id,
      date,
      students
    });
    res.status(201).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance by course
exports.getByCourse = async (req, res) => {
  try {
    const attendance = await Attendance.find({ course: req.params.course })
      .populate('students.student', 'name email rollNumber')
      .populate('faculty', 'name');
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      const mockHistory = [
        {
          _id: 'att1',
          course: 'Data Structures & Algorithms',
          faculty: { name: 'Dr. Sarah Connor' },
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          students: [{ student: 'student_mock_id', status: 'present' }]
        },
        {
          _id: 'att2',
          course: 'Web Development',
          faculty: { name: 'Dr. Sarah Connor' },
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          students: [{ student: 'student_mock_id', status: 'present' }]
        },
        {
          _id: 'att3',
          course: 'Data Structures & Algorithms',
          faculty: { name: 'Dr. Sarah Connor' },
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          students: [{ student: 'student_mock_id', status: 'absent' }]
        },
        {
          _id: 'att4',
          course: 'Database Management Systems',
          faculty: { name: 'Dr. Sarah Connor' },
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          students: [{ student: 'student_mock_id', status: 'present' }]
        },
        {
          _id: 'att5',
          course: 'Web Development',
          faculty: { name: 'Dr. Sarah Connor' },
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          students: [{ student: 'student_mock_id', status: 'late' }]
        }
      ];
      return res.status(200).json({
        success: true,
        total: 5,
        present: 4,
        percentage: '80.00',
        history: mockHistory
      });
    }

    const attendance = await Attendance.find({ 'students.student': req.params.studentId });
    const total = attendance.length;
    let present = 0;
    attendance.forEach(record => {
      record.students.forEach(s => {
        if (s.student.toString() === req.params.studentId && s.status === 'present') {
          present++;
        }
      });
    });
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
    res.status(200).json({ success: true, total, present, percentage, history: attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance (Admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('faculty', 'name')
      .sort({ date: -1 });
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check in student to a session using a code
exports.checkInSession = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Session code is required' });
    }

    // Try to find a class session matching the course code
    const attendance = await Attendance.findOne({ course: code }).sort({ date: -1 });
    if (!attendance) {
      return res.status(404).json({ message: `Active session for code '${code}' not found` });
    }

    // Check if student is already in the session roster
    const studentId = req.user.id;
    const studentIndex = attendance.students.findIndex(s => s.student.toString() === studentId);
    if (studentIndex > -1) {
      attendance.students[studentIndex].status = 'present';
    } else {
      attendance.students.push({ student: studentId, status: 'present' });
    }
    await attendance.save();

    res.status(200).json({ success: true, message: `Successfully checked into ${code}!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
