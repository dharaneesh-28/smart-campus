const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  banner: { type: String },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  registrationDeadline: { type: Date },
  totalSeats: { type: Number, default: 100 },
  registeredCount: { type: Number, default: 0 },
  speakers: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrations: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
