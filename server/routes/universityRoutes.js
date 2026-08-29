const express = require('express');
const router = express.Router();
const {
  getUniversities,
  getUniversityById,
  acceptChallenge
} = require('../controllers/universityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getUniversities);
router.get('/:id', getUniversityById);
router.post('/challenges/:problemId/accept', protect, authorize('university', 'admin'), acceptChallenge);

module.exports = router;
