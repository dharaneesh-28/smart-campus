const Placement = require('../models/Placement');

exports.createPlacement = async (req, res) => {
  try {
    const { company, jobRole, eligibility, ctc, deadline, description } = req.body;
    const placement = await Placement.create({ company, jobRole, eligibility, ctc, deadline, description });
    res.status(201).json({ success: true, placement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPlacements = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      const mockPlacements = [
        {
          _id: 'place1',
          company: 'Google',
          jobRole: 'Software Engineer Intern',
          ctc: '₹45 LPA',
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          eligibility: { minCGPA: 8.5, departments: ['CSE', 'IT'], semester: 5 },
          description: 'Join the Google Core Infrastructure team. Experience in algorithms, data structures, and system design is preferred.',
          applications: []
        },
        {
          _id: 'place2',
          company: 'Microsoft',
          jobRole: 'Associate Software Engineer',
          ctc: '₹38 LPA',
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          eligibility: { minCGPA: 8.0, departments: ['CSE', 'IT', 'ECE'], semester: 7 },
          description: 'Exciting opportunities to work in Azure Cloud Systems and Windows Development.',
          applications: []
        },
        {
          _id: 'place3',
          company: 'Amazon',
          jobRole: 'SDE-1',
          ctc: '₹32 LPA',
          deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          eligibility: { minCGPA: 7.5, departments: ['CSE', 'IT'], semester: 7 },
          description: 'Backend web services team role. Working on distributed systems scaling to millions of transactions.',
          applications: []
        }
      ];
      return res.status(200).json({ success: true, placements: mockPlacements });
    }

    const placements = await Placement.find().sort({ deadline: -1 });
    res.status(200).json({ success: true, placements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id).populate('applications.student', 'name email rollNumber');
    if (!placement) return res.status(404).json({ message: 'Placement not found' });
    res.status(200).json({ success: true, placement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyPlacement = async (req, res) => {
  try {
    const { resumeUrl } = req.body;
    const placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ message: 'Placement not found' });
    const alreadyApplied = placement.applications.find(a => a.student.toString() === req.user.id);
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });
    placement.applications.push({ student: req.user.id, resumeUrl });
    await placement.save();
    res.status(200).json({ success: true, message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ message: 'Placement not found' });
    const application = placement.applications.id(req.params.applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    application.status = status;
    await placement.save();
    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlacement = async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Placement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
