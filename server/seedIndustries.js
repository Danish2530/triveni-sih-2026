import 'dotenv/config';
import mongoose from 'mongoose';
import Industry from './models/Industry.js';

const industries = [
  {
    name: 'AquaTech Solutions',
    industryType: 'Water & Environmental Technology',
    location: 'Ranchi, Jharkhand',
    expertise: ['Water Resources', 'IoT', 'Sensors & Embedded Systems', 'Civil Engineering'],
    contactPerson: 'Rakesh Sharma',
    contactEmail: 'contact@aquatech.example.com'
  },
  {
    name: 'AgroNext Innovations',
    industryType: 'Agricultural Technology',
    location: 'Dumka, Jharkhand',
    expertise: ['Agricultural Engineering', 'Computer Vision / AI', 'IoT Sensors', 'Soil Science'],
    contactPerson: 'Priya Verma',
    contactEmail: 'hello@agronext.example.com'
  },
  {
    name: 'MediCare Rural Health Systems',
    industryType: 'Healthcare Technology',
    location: 'Ranchi, Jharkhand',
    expertise: ['Telemedicine', 'Mobile App Development', 'Biomedical Devices', 'GIS Mapping'],
    contactPerson: 'Dr. Anjali Singh',
    contactEmail: 'info@medicarerural.example.com'
  },
  {
    name: 'GreenGrid Energy',
    industryType: 'Renewable Energy',
    location: 'Bokaro, Jharkhand',
    expertise: ['Electrical Engineering', 'Solar Microgrid Architecture', 'Energy Management Systems'],
    contactPerson: 'Vikram Patel',
    contactEmail: 'partnerships@greengrid.example.com'
  },
  {
    name: 'CivicWaste Recyclers',
    industryType: 'Waste Management & Sanitation',
    location: 'Dhanbad, Jharkhand',
    expertise: ['Environmental Engineering', 'Smart Waste Monitoring', 'Civic Tech'],
    contactPerson: 'Neha Gupta',
    contactEmail: 'ops@civicwaste.example.com'
  }
];

const seedIndustries = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // <-- fixed variable name
    console.log('✅ Connected to MongoDB');

    await Industry.deleteMany({});
    const created = await Industry.insertMany(industries);

    console.log(`✅ Seeded ${created.length} industries:`);
    created.forEach(i => console.log(`   - ${i.name} (${i.expertise.join(', ')})`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedIndustries();