const express = require('express');
const router = express.Router();
const { createAssignment, getAllAssignments, getAssignment, submitAssignment, gradeSubmission, deleteAssignment } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('faculty', 'admin'), createAssignment);
router.get('/', protect, getAllAssignments);
router.get('/:id', protect, getAssignment);
router.post('/:id/submit', protect, authorize('student'), submitAssignment);
router.put('/:id/grade/:submissionId', protect, authorize('faculty', 'admin'), gradeSubmission);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteAssignment);

module.exports = router;
