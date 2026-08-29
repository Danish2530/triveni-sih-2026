import express from 'express';
import {
  getUniversities,
  getUniversityById,
  acceptChallenge
} from '../controllers/universityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getUniversities);
router.get('/:id', getUniversityById);
router.post('/challenges/:problemId/accept', protect, authorize('university', 'admin'), acceptChallenge);

export default router;
