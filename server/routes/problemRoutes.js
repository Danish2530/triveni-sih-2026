import express from 'express';
import {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  analyzeProblemOnly,
  matchUniversities
} from '../controllers/problemController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/analyze', analyzeProblemOnly);

router.route('/')
  .get(getProblems)
  .post(protect, createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(protect, updateProblem)
  .delete(protect, authorize('admin', 'citizen'), deleteProblem);

router.post('/:id/match', protect, matchUniversities);

export default router;
