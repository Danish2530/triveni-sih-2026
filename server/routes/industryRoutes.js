import express from 'express';
import {
  getIndustryProjects,
  partnerWithProject,
  getPartnerships,
  updatePartnershipStatus
} from '../controllers/industryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/projects', getIndustryProjects);
router.post('/projects/:id/partner', protect, authorize('industry', 'admin'), partnerWithProject);
router.get('/partnerships', getPartnerships);
router.put('/partnerships/:id/status', protect, authorize('university', 'admin'), updatePartnershipStatus);

export default router;
