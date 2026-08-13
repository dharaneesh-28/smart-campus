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
    res.status(200).json({ success: true, total, present, percentage });
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
