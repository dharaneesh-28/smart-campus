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
