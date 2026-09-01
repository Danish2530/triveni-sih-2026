import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Education',
      'Healthcare',
      'Agriculture',
      'Water Management',
      'Sanitation',
      'Environment',
      'Energy',
      'Urban Development',
      'Accessibility',
      'Public Administration',
      'Rural Livelihoods',
      'Other'
    ]
  },
  subcategory: {
    type: String,
    default: 'General'
  },
  district: {
    type: String,
    required: true
  },
  location: {
    village: { type: String, default: '' },
    latitude: { type: Number, default: 23.3441 },
    longitude: { type: Number, default: 85.3096 }
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  affectedPopulation: {
    type: Number,
    default: 500
  },
  images: [{ type: String }],
  videos: [{ type: String }],
  documents: [{ type: String }],

  aiAnalysis: {
    category: { type: String },
    subcategory: { type: String },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
    skills: [{ type: String }],
    keywords: [{ type: String }],
    estimatedImpact: { type: String }
  },

  status: {
    type: String,
    enum: [
      'Submitted',
      'Under Review',
      'Validated',
      'Assigned',
      'In Development',
      'Testing',
      'Deployed',
      'Resolved'
    ],
    default: 'Submitted'
  },

  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  recommendedUniversities: [
    {
      universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
      name: { type: String },
      matchScore: { type: Number }
    }
  ],

  assignedUniversity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University'
  },

  recommendedIndustries: [
    {
      industryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
      name: { type: String },
      matchScore: { type: Number }
    }
  ],

  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    default: null
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

export default mongoose.model('Problem', problemSchema);
