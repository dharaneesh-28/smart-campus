const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, course, deadline, maxMarks } = req.body;
    const assignment = await Assignment.create({
      title, description, course, faculty: req.user.id, deadline, maxMarks
    });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      const mockAssignments = [
        {
          _id: 'assign1',
          title: 'Linked List Implementation',
          description: 'Implement a doubly linked list in C++ and analyze its space/time complexity.',
          course: 'Data Structures & Algorithms',
          faculty: { name: 'Dr. Sarah Connor' },
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          maxMarks: 100,
          submissions: []
        },
        {
          _id: 'assign2',
          title: 'React Portfolio Website',
          description: 'Build a fully responsive portfolio website using Tailwind CSS and React.',
          course: 'Web Development',
          faculty: { name: 'Dr. Sarah Connor' },
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          maxMarks: 50,
          submissions: []
        },
        {
          _id: 'assign3',
          title: 'SQL Query Optimization',
          description: 'Optimize the given query schema and generate index configurations.',
          course: 'Database Management Systems',
          faculty: { name: 'Dr. Sarah Connor' },
          deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          maxMarks: 75,
          submissions: [
            {
              student: 'student_mock_id',
              githubLink: 'https://github.com/student/dbms-opt',
              marks: 68,
              feedback: 'Excellent work on query indexing and plan explanations!',
              status: 'graded'
            }
          ]
        }
      ];
      return res.status(200).json({ success: true, assignments: mockAssignments });
    }

    const assignments = await Assignment.find().populate('faculty', 'name').sort({ deadline: -1 });
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('faculty', 'name')
      .populate('submissions.student', 'name email rollNumber');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { fileUrl, githubLink } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    const isLate = new Date() > new Date(assignment.deadline);
    assignment.submissions.push({ student: req.user.id, fileUrl, githubLink, isLate });
    await assignment.save();
    res.status(200).json({ success: true, message: 'Assignment submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = 'graded';
    await assignment.save();
    res.status(200).json({ success: true, message: 'Graded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
