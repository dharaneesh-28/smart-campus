const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, venue, date, registrationDeadline, totalSeats, speakers } = req.body;
    const event = await Event.create({
      title, description, venue, date, registrationDeadline, totalSeats, speakers, createdBy: req.user.id
    });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      const mockEvents = [
        {
          _id: 'event1',
          title: 'DevFusion 4.O Hackathon Kickoff',
          description: 'Get ready for the annual 24-hour campus hacking event! Brainstorm, build, and present.',
          venue: 'Main Seminar Hall & online',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          registrationDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          totalSeats: 150,
          registeredCount: 42,
          speakers: ['Satya Nadella (Hon.)', 'Sunder Pichai (Hon.)'],
          createdBy: { name: 'Alex Coordinator' },
          registrations: []
        },
        {
          _id: 'event2',
          title: 'AI & Web 3.0 Workshop',
          description: 'Learn how LLMs and smart contracts are shaping SaaS applications.',
          venue: 'CSE Lab 4',
          date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          totalSeats: 50,
          registeredCount: 49,
          speakers: ['Dr. Andrew Ng (Guest video)'],
          createdBy: { name: 'Alex Coordinator' },
          registrations: []
        }
      ];
      return res.status(200).json({ success: true, events: mockEvents });
    }

    const events = await Event.find().populate('createdBy', 'name').sort({ date: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('registrations.student', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.registeredCount >= event.totalSeats) return res.status(400).json({ message: 'Event is full' });
    const alreadyRegistered = event.registrations.find(r => r.student.toString() === req.user.id);
    if (alreadyRegistered) return res.status(400).json({ message: 'Already registered' });
    event.registrations.push({ student: req.user.id });
    event.registeredCount += 1;
    await event.save();
    res.status(200).json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.registrations = event.registrations.filter(r => r.student.toString() !== req.user.id);
    event.registeredCount -= 1;
    await event.save();
    res.status(200).json({ success: true, message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
