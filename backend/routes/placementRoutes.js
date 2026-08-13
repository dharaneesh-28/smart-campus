const express = require('express');
const router = express.Router();
const { createPlacement, getAllPlacements, getPlacement, applyPlacement, updateApplicationStatus, deletePlacement } = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), createPlacement);
router.get('/', protect, getAllPlacements);
router.get('/:id', protect, getPlacement);
router.post('/:id/apply', protect, authorize('student'), applyPlacement);
router.put('/:id/status/:applicationId', protect, authorize('admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('admin'), deletePlacement);

module.exports = router;
