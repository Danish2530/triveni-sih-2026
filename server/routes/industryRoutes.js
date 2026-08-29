const express = require('express');
const router = express.Router();
const {
  getIndustryProjects,
  partnerWithProject,
  getPartnerships,
  updatePartnershipStatus
} = require('../controllers/industryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/projects', getIndustryProjects);
router.post('/projects/:id/partner', protect, authorize('industry', 'admin'), partnerWithProject);
router.get('/partnerships', getPartnerships);
router.put('/partnerships/:id/status', protect, authorize('university', 'admin'), updatePartnershipStatus);

module.exports = router;
