const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: { type: Date, required: true },
  maxMarks: { type: Number, default: 100 },
  attachments: [String],
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: { type: String },
    githubLink: { type: String },
    submittedAt: { type: Date, default: Date.now },
    isLate: { type: Boolean, default: false },
    marks: { type: Number },
    feedback: { type: String },
    status: { type: String, enum: ['pending', 'reviewed', 'graded'], default: 'pending' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
