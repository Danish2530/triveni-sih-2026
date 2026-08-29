const express = require('express');
const router = express.Router();
const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  analyzeProblemOnly,
  matchUniversities
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/analyze', analyzeProblemOnly);

router.route('/')
  .get(getProblems)
  .post(protect, createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(protect, updateProblem)
  .delete(protect, authorize('admin', 'citizen'), deleteProblem);

router.post('/:id/match', protect, matchUniversities);

module.exports = router;
