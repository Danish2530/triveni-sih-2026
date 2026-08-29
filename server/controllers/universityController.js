import University from '../models/University.js';
import Problem from '../models/Problem.js';
import Notification from '../models/Notification.js';

// @desc Get all universities
// @route GET /api/universities
export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find({});
    res.json(universities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch universities', error: error.message });
  }
};

// @desc Get university details
// @route GET /api/universities/:id
export const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    res.json(university);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch university details', error: error.message });
  }
};

// @desc University accepts a challenge
// @route POST /api/universities/challenges/:problemId/accept
export const acceptChallenge = async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem challenge not found' });
    }

    let university = await University.findOne({ user: req.user._id });
    if (!university) {
      university = await University.findOne({});
    }

    if (!university) {
      return res.status(400).json({ message: 'No registered university profile found' });
    }

    problem.status = 'Assigned';
    problem.assignedUniversity = university._id;
    problem.updatedAt = Date.now();
    await problem.save();

    await Notification.create({
      recipientId: problem.submittedBy,
      recipientRole: 'citizen',
      title: 'Challenge Accepted!',
      message: `${university.name} has accepted your societal challenge "${problem.title}".`,
      link: `/problems/${problem._id}`
    });

    await Notification.create({
      recipientId: req.user._id,
      recipientRole: 'university',
      title: 'Challenge Assigned',
      message: `You have successfully accepted "${problem.title}". You can now spawn a R&D Project.`,
      link: `/university/create-project?problemId=${problem._id}`
    });

    res.json({
      message: 'Challenge accepted successfully',
      problem,
      university
    });
  } catch (error) {
    console.error('Accept Challenge Error:', error);
    res.status(500).json({ message: 'Failed to accept challenge', error: error.message });
  }
};
