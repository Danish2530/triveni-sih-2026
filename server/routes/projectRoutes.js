import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addMilestone,
  updateMilestone,
  updateKanban
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, authorize('university', 'admin'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, authorize('university', 'admin'), updateProject);

router.post('/:id/milestones', protect, authorize('university', 'admin'), addMilestone);
router.put('/:id/milestones/:milestoneId', protect, authorize('university', 'admin'), updateMilestone);
router.put('/:id/kanban', protect, updateKanban);

export default router;
