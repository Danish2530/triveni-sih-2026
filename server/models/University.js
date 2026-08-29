import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  district: {
    type: String,
    default: 'Ranchi'
  },
  departments: [{
    type: String
  }],
  expertise: [{
    type: String
  }],
  researchAreas: [{
    type: String
  }],
  faculty: [{
    name: String,
    email: String,
    department: String,
    designation: String
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contactEmail: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('University', universitySchema);
