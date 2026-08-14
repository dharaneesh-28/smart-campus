const mongoose = require('mongoose');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Event = require('../models/Event');
const Placement = require('../models/Placement');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
require('dotenv').config();

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-campus';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Assignment.deleteMany({});
    await Event.deleteMany({});
    await Placement.deleteMany({});
    await Attendance.deleteMany({});
    await Notification.deleteMany({});

    console.log('Existing collections cleared.');

    // 1. Seed Users
    const users = await User.create([
      {
        name: 'Dharaneesh Admin',
        email: 'admin@gmail.com',
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
        department: 'CSE',
        isEmailVerified: true
      },
      {
        name: 'Dr. Sarah Connor',
        email: 'faculty@gmail.com',
        password: 'faculty123',
        role: 'faculty',
        department: 'CSE',
        isEmailVerified: true
      },
      {
        name: 'Alex Coordinator',
        email: 'coordinator@gmail.com',
        password: 'coordinator123',
        role: 'coordinator',
        department: 'IT',
        isEmailVerified: true
      },
      {
        name: 'John Student Doe',
        email: 'student@gmail.com',
        password: 'student123',
        role: 'student',
        department: 'CSE',
        semester: 5,
        rollNumber: 'CSE-2024-042',
        phone: '9876543210',
        skills: ['React', 'Node.js', 'MongoDB', 'Python'],
        linkedin: 'https://linkedin.com/in/student',
        github: 'https://github.com/student',
        bio: 'Aspiring Full Stack Developer passionate about campus tech.',
        isEmailVerified: true
      }
    ]);

    const admin = users[0];
    const faculty = users[1];
    const coordinator = users[2];
    const student = users[3];

    console.log('Users seeded successfully. Credentials:');
    console.log('  Admin:       admin@gmail.com / admin123');
    console.log('  Faculty:     faculty@gmail.com / faculty123');
    console.log('  Coordinator: coordinator@gmail.com / coordinator123');
    console.log('  Student:     student@gmail.com / student123');

    // 2. Seed Assignments
    const assignments = await Assignment.create([
      {
        title: 'Linked List Implementation',
        description: 'Implement a doubly linked list in C++ and analyze its space/time complexity.',
        course: 'Data Structures & Algorithms',
        faculty: faculty._id,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        maxMarks: 100
      },
      {
        title: 'React Portfolio Website',
        description: 'Build a fully responsive portfolio website using Tailwind CSS and React.',
        course: 'Web Development',
        faculty: faculty._id,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        maxMarks: 50
      },
      {
        title: 'SQL Query Optimization',
        description: 'Optimize the given query schema and generate index configurations.',
        course: 'Database Management Systems',
        faculty: faculty._id,
        deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (ended)
        maxMarks: 75,
        submissions: [
          {
            student: student._id,
            githubLink: 'https://github.com/student/dbms-opt',
            marks: 68,
            feedback: 'Excellent work on query indexing and plan explanations!',
            status: 'graded'
          }
        ]
      }
    ]);

    console.log('Assignments seeded successfully.');

    // 3. Seed Placements
    const placements = await Placement.create([
      {
        company: 'Google',
        jobRole: 'Software Engineer Intern',
        ctc: '₹45 LPA',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        eligibility: { minCGPA: 8.5, departments: ['CSE', 'IT'], semester: 5 },
        description: 'Join the Google Core Infrastructure team. Experience in algorithms, data structures, and system design is preferred.'
      },
      {
        company: 'Microsoft',
        jobRole: 'Associate Software Engineer',
        ctc: '₹38 LPA',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: { minCGPA: 8.0, departments: ['CSE', 'IT', 'ECE'], semester: 7 },
        description: 'Exciting opportunities to work in Azure Cloud Systems and Windows Development.'
      },
      {
        company: 'Amazon',
        jobRole: 'SDE-1',
        ctc: '₹32 LPA',
        deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        eligibility: { minCGPA: 7.5, departments: ['CSE', 'IT'], semester: 7 },
        description: 'Backend web services team role. Working on distributed systems scaling to millions of transactions.'
      }
    ]);

    console.log('Placements seeded successfully.');

    // 4. Seed Events
    const events = await Event.create([
      {
        title: 'DevFusion 4.O Hackathon Kickoff',
        description: 'Get ready for the annual 24-hour campus hacking event! Brainstorm, build, and present.',
        venue: 'Main Seminar Hall & online',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        totalSeats: 150,
        registeredCount: 42,
        speakers: ['Satya Nadella (Hon.)', 'Sunder Pichai (Hon.)'],
        createdBy: coordinator._id
      },
      {
        title: 'AI & Web 3.0 Workshop',
        description: 'Learn how LLMs and smart contracts are shaping SaaS applications.',
        venue: 'CSE Lab 4',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        totalSeats: 50,
        registeredCount: 49,
        speakers: ['Dr. Andrew Ng (Guest video)', 'Sam Altman (AI Guest)'],
        createdBy: coordinator._id
      }
    ]);

    console.log('Events seeded successfully.');

    // 5. Seed Attendance Logs
    await Attendance.create([
      {
        course: 'Data Structures & Algorithms',
        faculty: faculty._id,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        students: [{ student: student._id, status: 'present' }]
      },
      {
        course: 'Web Development',
        faculty: faculty._id,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        students: [{ student: student._id, status: 'present' }]
      },
      {
        course: 'Data Structures & Algorithms',
        faculty: faculty._id,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        students: [{ student: student._id, status: 'absent' }]
      },
      {
        course: 'Database Management Systems',
        faculty: faculty._id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        students: [{ student: student._id, status: 'present' }]
      },
      {
        course: 'Web Development',
        faculty: faculty._id,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        students: [{ student: student._id, status: 'late' }]
      }
    ]);

    console.log('Attendance seeded successfully.');

    // 6. Seed Notifications
    await Notification.create([
      {
        user: student._id,
        title: 'New Assignment Posted',
        message: 'Dr. Sarah Connor posted "Linked List Implementation" in DSA.',
        type: 'assignment'
      },
      {
        user: student._id,
        title: 'Google Recruitment Open',
        message: 'Google has opened submissions for SDE Intern (45 LPA). Register now!',
        type: 'placement'
      },
      {
        user: student._id,
        title: 'Welcome to Smart Campus',
        message: 'Your email has been verified. Welcome to the DevFusion 4.O Management Platform!',
        type: 'system'
      }
    ]);

    console.log('Notifications seeded successfully.');
    console.log('Database Seeding Complete! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seedData();
