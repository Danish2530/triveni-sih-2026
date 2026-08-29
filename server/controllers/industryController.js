import Industry from '../models/Industry.js';
import Project from '../models/Project.js';
import Partnership from '../models/Partnership.js';
import Notification from '../models/Notification.js';

// @desc Get projects available for industry collaboration
// @route GET /api/industry/projects
export const getIndustryProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('problemId', 'title category district location urgency affectedPopulation')
      .populate('universityId', 'name location departments expertise')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch industry projects', error: error.message });
  }
};

// @desc Industry sends partnership proposal for a project
// @route POST /api/projects/:id/partner
export const partnerWithProject = async (req, res) => {
  try {
    const { contributions, message } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId).populate('universityId');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let industry = await Industry.findOne({ user: req.user._id });
    if (!industry) {
      industry = await Industry.findOne({}) || {
        _id: req.user._id,
        name: req.user.organization || req.user.name || 'TechCorp Innovations'
      };
    }

    const partnership = await Partnership.create({
      projectId,
      industryId: industry._id,
      industryName: industry.name,
      contributions: contributions || ['Mentorship', 'Hardware'],
      message: message || 'We are excited to contribute hardware components and expert technical mentorship to this solution.',
      status: 'Pending'
    });

    if (project.universityId && project.universityId.user) {
      await Notification.create({
        recipientId: project.universityId.user,
        recipientRole: 'university',
        title: 'New Industry Partner Request!',
        message: `${industry.name} requested to partner on "${project.title}" offering ${partnership.contributions.join(', ')}.`,
        link: `/projects/${project._id}`
      });
    }

    res.status(201).json({
      message: 'Partnership request submitted successfully',
      partnership
    });
  } catch (error) {
    console.error('Partner error:', error);
    res.status(500).json({ message: 'Failed to submit partnership request', error: error.message });
  }
};

// @desc Get all partnerships (filtered by project or industry)
// @route GET /api/industry/partnerships
export const getPartnerships = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;

    const partnerships = await Partnership.find(filter)
      .populate('projectId', 'title status progress')
      .populate('industryId', 'name industryType contactEmail contactPerson')
      .sort({ createdAt: -1 });

    res.json(partnerships);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch partnerships', error: error.message });
  }
};

// @desc University accepts/rejects industry partnership
// @route PUT /api/industry/partnerships/:id/status
export const updatePartnershipStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({ message: 'Partnership request not found' });
    }

    partnership.status = status;
    await partnership.save();

    if (status === 'Accepted') {
      const project = await Project.findById(partnership.projectId);
      if (project) {
        project.industryPartners.push({
          industryId: partnership.industryId,
          name: partnership.industryName,
          contributions: partnership.contributions
        });
        project.progress = Math.min(100, project.progress + 15);
        await project.save();
      }

      const industry = await Industry.findById(partnership.industryId);
      if (industry && industry.user) {
        await Notification.create({
          recipientId: industry.user,
          recipientRole: 'industry',
          title: 'Partnership Accepted!',
          message: `Your partnership offer for "${project ? project.title : 'Project'}" has been ACCEPTED by the university team.`,
          link: `/projects/${partnership.projectId}`
        });
      }
    }

    res.json({
      message: `Partnership ${status.toLowerCase()} successfully`,
      partnership
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update partnership status', error: error.message });
  }
};
