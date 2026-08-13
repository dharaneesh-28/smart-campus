const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  company: { type: String, required: true },
  logo: { type: String },
  jobRole: { type: String, required: true },
  eligibility: {
    minCGPA: { type: Number, default: 0 },
    departments: [String],
    semester: { type: Number }
  },
  ctc: { type: String },
  deadline: { type: Date },
  description: { type: String },
  applications: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resumeUrl: { type: String },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'selected'], default: 'applied' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Placement', placementSchema);
