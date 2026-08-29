const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addMilestone,
  updateMilestone,
  updateKanban
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, authorize('university', 'admin'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, authorize('university', 'admin'), updateProject);

router.post('/:id/milestones', protect, authorize('university', 'admin'), addMilestone);
router.put('/:id/milestones/:milestoneId', protect, authorize('university', 'admin'), updateMilestone);
router.put('/:id/kanban', protect, updateKanban);

module.exports = router;
