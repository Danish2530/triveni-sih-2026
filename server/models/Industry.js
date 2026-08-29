import mongoose from 'mongoose';

const industrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  industryType: {
    type: String,
    default: 'Technology & Hardware'
  },
  location: {
    type: String,
    default: 'Ranchi, Jharkhand'
  },
  expertise: [{
    type: String
  }],
  contactPerson: {
    type: String
  },
  contactEmail: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Industry', industrySchema);
