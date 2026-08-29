const Project = require('../models/Project');
const Problem = require('../models/Problem');
const University = require('../models/University');
const Notification = require('../models/Notification');

// @desc Create a project for an accepted challenge
// @route POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const {
      problemId,
      universityId,
      title,
      description,
      facultyMentor,
      students,
      milestones,
      expectedOutcome
    } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Associated problem challenge not found' });
    }

    let uniId = universityId;
    if (!uniId) {
      const university = await University.findOne({ user: req.user._id }) || await University.findOne({});
      uniId = university ? university._id : null;
    }

    const defaultMilestones = milestones && milestones.length > 0 ? milestones : [
      { title: 'Problem Validation & Field Survey', status: 'Completed', completedAt: new Date() },
      { title: 'System Architecture & Requirements Analysis', status: 'Completed', completedAt: new Date() },
      { title: 'Hardware & Sensor Selection', status: 'In Progress' },
      { title: 'IoT Prototype & Dashboard Integration', status: 'Pending' },
      { title: 'Field Testing & Citizen Feedback', status: 'Pending' },
      { title: 'Final Solution Deployment & Impact Audit', status: 'Pending' }
    ];

    const project = await Project.create({
      problemId,
      universityId: uniId,
      title: title || `Solution: ${problem.title}`,
      description: description || problem.description,
      facultyMentor: facultyMentor || { name: 'Dr. Raj Sharma', email: 'faculty@demo.com', department: 'CSE' },
      students: students || [
        { name: 'Rahul Kumar', email: 'rahul@student.demo', department: 'Computer Science', role: 'Lead Developer' },
        { name: 'Aman Singh', email: 'aman@student.demo', department: 'Electronics', role: 'IoT Hardware Spec' },
        { name: 'Priya Verma', email: 'priya@student.demo', department: 'Civil Engineering', role: 'Field Researcher' }
      ],
      milestones: defaultMilestones,
      progress: 35,
      status: 'Development',
      kanban: {
        todo: ['Sensor Selection & Component Sourcing', 'Cloud Server Middleware Setup'],
        inProgress: ['IoT Microcontroller Firmware', 'Mobile Citizen Alert System'],
        testing: ['Water Level Sensor Calibration'],
        completed: ['Problem Survey in Dumka', 'Architecture Blueprint']
      },
      solutionProposal: expectedOutcome || 'Smart IoT-enabled automated water level & supply management solution.'
    });

    // Update Problem Status to 'In Development'
    problem.status = 'In Development';
    problem.assignedUniversity = uniId;
    await problem.save();

    // Create Notification
    await Notification.create({
      recipientId: problem.submittedBy,
      recipientRole: 'citizen',
      title: 'Project Started for Your Challenge!',
      message: `Project "${project.title}" has officially launched for your challenge "${problem.title}".`,
      link: `/projects/${project._id}`
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

// @desc Get all projects
// @route GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const { status, universityId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (universityId) filter.universityId = universityId;

    const projects = await Project.find(filter)
      .populate('problemId', 'title category district urgency status location')
      .populate('universityId', 'name location departments')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

// @desc Get single project details
// @route GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('problemId')
      .populate('universityId')
      .populate('industryPartners.industryId');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project details', error: error.message });
  }
};

// @desc Update project details/status/progress
// @route PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    Object.assign(project, req.body);
    project.updatedAt = Date.now();
    await project.save();

    // Sync Problem status if project reached Deployed/Completed
    if (['Deployed', 'Completed'].includes(project.status)) {
      await Problem.findByIdAndUpdate(project.problemId, { status: project.status === 'Deployed' ? 'Deployed' : 'Resolved' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};

// @desc Add Milestone to Project
// @route POST /api/projects/:id/milestones
exports.addMilestone = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.milestones.push({
      title,
      description,
      dueDate,
      status: 'Pending'
    });

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add milestone', error: error.message });
  }
};

// @desc Update Milestone status
// @route PUT /api/projects/:id/milestones/:milestoneId
exports.updateMilestone = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.status = status;
    if (status === 'Completed') {
      milestone.completedAt = new Date();
    }

    // Recalculate progress percentage
    const completedCount = project.milestones.filter(m => m.status === 'Completed').length;
    project.progress = Math.round((completedCount / project.milestones.length) * 100);

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update milestone', error: error.message });
  }
};

// @desc Update Kanban columns
// @route PUT /api/projects/:id/kanban
exports.updateKanban = async (req, res) => {
  try {
    const { kanban } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.kanban = kanban;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update kanban', error: error.message });
  }
};
