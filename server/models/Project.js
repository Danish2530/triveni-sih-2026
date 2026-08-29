import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  facultyMentor: {
    name: { type: String, default: 'Dr. Raj Sharma' },
    email: { type: String, default: 'faculty@demo.com' },
    department: { type: String, default: 'Computer Science & Engineering' }
  },
  students: [
    {
      name: { type: String },
      email: { type: String },
      department: { type: String },
      role: { type: String, default: 'Student Researcher' }
    }
  ],
  industryPartners: [
    {
      industryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
      name: { type: String },
      contributions: [{ type: String }],
      partneredAt: { type: Date, default: Date.now }
    }
  ],
  milestones: [
    {
      title: { type: String, required: true },
      description: { type: String },
      dueDate: { type: String },
      status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
      },
      completedAt: { type: Date }
    }
  ],
  kanban: {
    todo: [{ type: String }],
    inProgress: [{ type: String }],
    testing: [{ type: String }],
    completed: [{ type: String }]
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['Planning', 'Development', 'Testing', 'Deployed', 'Completed'],
    default: 'Planning'
  },
  solutionProposal: {
    type: String,
    default: ''
  },
  impact: {
    peopleBenefited: { type: Number, default: 0 },
    metrics: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Project', projectSchema);
