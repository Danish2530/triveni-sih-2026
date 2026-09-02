import Problem from '../models/Problem.js';
import Notification from '../models/Notification.js';
import { analyzeProblem } from '../services/aiService.js';
import { matchUniversitiesForProblem } from '../services/matchingService.js';
import { matchIndustriesForProblem } from '../services/industryMatchingService.js'; // <-- new
import { checkForDuplicates } from '../services/duplicateService.js';
import { uploadOnCloudinary } from '../services/cloudinary.js';
import { computeImpact } from '../services/impactEngine.js';
 
export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      district,
      village,
      latitude,
      longitude,
      urgency,
      affectedPopulation,
    } = req.body;
 
    // 0. Upload images to cloudinary (if any were sent)
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map((file) => uploadOnCloudinary(file.path))
      );
      imageUrls = uploadResults.filter(Boolean).map((r) => r.secure_url || r.url);
    }
 
    // 1. AI Problem Analysis
    const aiAnalysis = await analyzeProblem({ title, description, category });
 
    // 2. Duplicate Detection
    const dupResult = await checkForDuplicates({ title, description, category, district });
 
    // 2b. Impact Score Engine — count existing reports of the same underlying
    // issue (the original this one duplicates, plus its other duplicates)
    // so the score reflects "how many people this is really affecting".
    let duplicateCountForImpact = 0;
    if (dupResult.isDuplicate) {
      duplicateCountForImpact = await Problem.countDocuments({
        $or: [
          { duplicateOf: dupResult.existingProblem.id },
          { _id: dupResult.existingProblem.id }
        ]
      });
    }
 
    const impact = computeImpact(
      {
        urgency: urgency || aiAnalysis.priority.charAt(0) + aiAnalysis.priority.slice(1).toLowerCase(),
        affectedPopulation: affectedPopulation ? parseInt(affectedPopulation) : 500,
        category: category || aiAnalysis.category,
        createdAt: new Date()
      },
      duplicateCountForImpact
    );
 
    // 3. Create Draft Problem Document
    const problem = new Problem({
      title,
      description,
      category: category || aiAnalysis.category,
      subcategory: aiAnalysis.subcategory,
      district,
      location: {
        village: village || '',
        latitude: latitude ? parseFloat(latitude) : 23.3441,
        longitude: longitude ? parseFloat(longitude) : 85.3096
      },
      urgency: urgency || aiAnalysis.priority.charAt(0) + aiAnalysis.priority.slice(1).toLowerCase(),
      affectedPopulation: affectedPopulation ? parseInt(affectedPopulation) : 500,
      images: imageUrls.length > 0
        ? imageUrls
        : ['https://images.unsplash.com/photo-1541888946425-d0fbb186c5f0?w=600&auto=format&fit=crop&q=60'],
      videos: [],
      documents: [],
      aiAnalysis,
      status: 'Submitted',
      submittedBy: req.user._id,
      duplicateOf: dupResult.isDuplicate ? dupResult.existingProblem.id : null, // <-- new
      impact // <-- new
    });
 
    // 4. Matching — SKIPPED for duplicates, so only the original gets sent to universities/industries
    if (!dupResult.isDuplicate) {
      const uniMatches = await matchUniversitiesForProblem(problem);
      problem.recommendedUniversities = uniMatches.slice(0, 5).map(m => ({
        universityId: m.universityId,
        name: m.name,
        matchScore: m.matchScore
      }));
 
      const industryMatches = await matchIndustriesForProblem(problem); // <-- new
      problem.recommendedIndustries = industryMatches.slice(0, 5).map(m => ({
        industryId: m.industryId,
        name: m.name,
        matchScore: m.matchScore
      }));
    }
 
    await problem.save();
 
    // 4b. If this was a duplicate, bump the original's impact score too —
    // this is what makes the "17 reports -> rising severity" story visible.
    if (dupResult.isDuplicate) {
      const originalProblem = await Problem.findById(dupResult.existingProblem.id);
      if (originalProblem) {
        const newDuplicateCount = await Problem.countDocuments({ duplicateOf: originalProblem._id });
        originalProblem.impact = computeImpact(originalProblem, newDuplicateCount);
        await originalProblem.save();
      }
    }
 
    // 5. Notification — different message for duplicates vs originals
    if (dupResult.isDuplicate) {
      await Notification.create({
        recipientId: req.user._id,
        recipientRole: 'citizen',
        title: 'Similar Challenge Already Being Addressed',
        message: `Your challenge "${title}" closely matches an existing report (${dupResult.existingProblem.code}) already under review. It's been logged and linked — no duplicate work will be sent to universities.`,
        link: `/problems/${dupResult.existingProblem.id}`
      });
    } else {
      await Notification.create({
        recipientId: req.user._id,
        recipientRole: 'citizen',
        title: 'Problem Challenge Submitted',
        message: `Your challenge "${title}" has been successfully logged and analyzed by AI.`,
        link: `/problems/${problem._id}`
      });
    }
 
    res.status(201).json({
      problem,
      duplicateWarning: dupResult.isDuplicate ? dupResult : null
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ message: 'Failed to submit problem challenge', error: error.message });
  }
};
 
// ...rest of file (getProblems, getProblemById, etc.) stays exactly as-is
 
// @desc Get all problems
// @route GET /api/problems
export const getProblems = async (req, res) => {
  try {
    const { category, district, status, mine } = req.query;
    const filter = {};
 
    if (category) filter.category = category;
    if (district) filter.district = district;
    if (status) filter.status = status;
    if (mine === 'true' && req.user) filter.submittedBy = req.user._id;
 
    const problems = await Problem.find(filter)
      .populate('submittedBy', 'name email organization')
      .populate('assignedUniversity', 'name location district')
      .sort({ createdAt: -1 });
 
    res.json(problems);
  } catch (error) {
    console.error('Error getting problems:', error);
    res.status(500).json({ message: 'Error fetching problems', error: error.message });
  }
};
 
// @desc Get single problem details
// @route GET /api/problems/:id
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('submittedBy', 'name email organization phone')
      .populate('assignedUniversity', 'name location departments expertise researchAreas faculty contactEmail');
 
    if (!problem) {
      return res.status(404).json({ message: 'Problem challenge not found' });
    }
 
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem details', error: error.message });
  }
};
 
// @desc Update problem status or details
// @route PUT /api/problems/:id
export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem challenge not found' });
    }
 
    Object.assign(problem, req.body);
    problem.updatedAt = Date.now();
    await problem.save();
 
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating problem', error: error.message });
  }
};
 
// @desc Delete problem
// @route DELETE /api/problems/:id
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem challenge not found' });
    }
 
    await problem.deleteOne();
    res.json({ message: 'Problem challenge removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting problem', error: error.message });
  }
};
 
// @desc Standalone AI Analysis Endpoint
// @route POST /api/problems/analyze
export const analyzeProblemOnly = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const analysis = await analyzeProblem({ title, description, category });
    const duplicateCheck = await checkForDuplicates({ title, description, category });
 
    res.json({
      analysis,
      duplicateCheck
    });
  } catch (error) {
    res.status(500).json({ message: 'AI Analysis failed', error: error.message });
  }
};
 
// @desc Re-calculate impact score for a problem (e.g. after time passes,
// or to demo the engine live without resubmitting a report)
// @route POST /api/problems/:id/recompute-impact
export const recomputeImpact = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
 
    const duplicateCount = await Problem.countDocuments({ duplicateOf: problem._id });
    problem.impact = computeImpact(problem, duplicateCount);
    await problem.save();
 
    res.json(problem.impact);
  } catch (error) {
    res.status(500).json({ message: 'Impact recomputation failed', error: error.message });
  }
};
 
// @desc Re-calculate University Matches for a problem
// @route POST /api/problems/:id/match
export const matchUniversities = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
 
    const matches = await matchUniversitiesForProblem(problem);
    problem.recommendedUniversities = matches.slice(0, 5).map(m => ({
      universityId: m.universityId,
      name: m.name,
      matchScore: m.matchScore
    }));
 
    await problem.save();
    res.json(problem.recommendedUniversities);
  } catch (error) {
    res.status(500).json({ message: 'University matching failed', error: error.message });
  }
};