const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ['student', 'faculty', 'coordinator', 'admin'],
    default: 'student'
  },
  profilePicture: { type: String, default: '' },
  phone: { type: String },
  department: { type: String },
  rollNumber: { type: String },
  semester: { type: Number },
  skills: [String],
  linkedin: { type: String },
  github: { type: String },
  bio: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  googleId: { type: String }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
