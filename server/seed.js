import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Problem from './models/Problem.js';
import University from './models/University.js';
import Project from './models/Project.js';
import Industry from './models/Industry.js';
import Partnership from './models/Partnership.js';
import Notification from './models/Notification.js';
import { analyzeProblem } from './services/aiService.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany({});
    await Problem.deleteMany({});
    await University.deleteMany({});
    await Project.deleteMany({});
    await Industry.deleteMany({});
    await Partnership.deleteMany({});
    await Notification.deleteMany({});

    console.log('👤 Seeding Users & Demo Accounts...');
    const createdUsers = await User.create([
      {
        name: 'Ramesh Mahto (Citizen)',
        email: 'citizen@demo.com',
        password: 'password123',
        role: 'citizen',
        organization: 'Dumka Rural Gram Panchayat',
        phone: '+91 98765 43210'
      },
      {
        name: 'BIT Mesra Innovation Cell',
        email: 'university@demo.com',
        password: 'password123',
        role: 'university',
        organization: 'Birla Institute of Technology Mesra',
        phone: '+91 651 2275444'
      },
      {
        name: 'Dr. Raj Sharma (Faculty Mentor)',
        email: 'faculty@demo.com',
        password: 'password123',
        role: 'faculty',
        organization: 'Department of Computer Science, BIT Mesra'
      },
      {
        name: 'Rahul Kumar (Student Developer)',
        email: 'student@demo.com',
        password: 'password123',
        role: 'student',
        organization: 'BIT Mesra - B.Tech CSE'
      },
      {
        name: 'Tata Steel CSR & Tech',
        email: 'industry@demo.com',
        password: 'password123',
        role: 'industry',
        organization: 'Tata Steel Foundation',
        phone: '+91 657 2426821'
      },
      {
        name: 'Jharkhand State Innovation Council',
        email: 'government@demo.com',
        password: 'password123',
        role: 'government',
        organization: 'Dept of Science & Technology, Govt of Jharkhand'
      },
      {
        name: 'SIH Platform Moderator',
        email: 'admin@demo.com',
        password: 'password123',
        role: 'admin',
        organization: 'SIH 2026 Admin Portal'
      }
    ]);

    const citizenUser = createdUsers.find(u => u.role === 'citizen');
    const universityUser = createdUsers.find(u => u.role === 'university');
    const industryUser = createdUsers.find(u => u.role === 'industry');

    console.log('🏛️ Seeding Universities...');
    const createdUniversities = await University.create([
      {
        name: 'BIT Mesra',
        location: 'Ranchi, Jharkhand',
        district: 'Ranchi',
        departments: ['Computer Science & Engineering', 'Electronics & Communication', 'Civil Engineering', 'Chemical Engineering'],
        expertise: ['IoT', 'Artificial Intelligence', 'Water Management', 'Smart Infrastructure', 'Embedded Systems'],
        researchAreas: ['Smart Cities', 'Environmental Sensing', 'Hydrological Modeling'],
        user: universityUser._id,
        contactEmail: 'university@demo.com',
        faculty: [
          { name: 'Dr. Raj Sharma', email: 'faculty@demo.com', department: 'Computer Science', designation: 'Professor & Head of Innovation' },
          { name: 'Dr. Anita Roy', email: 'anita@bitmesra.ac.in', department: 'Civil Engineering', designation: 'Associate Professor' }
        ]
      },
      {
        name: 'NIT Jamshedpur',
        location: 'Jamshedpur, Jharkhand',
        district: 'East Singhbhum',
        departments: ['Computer Applications', 'Electrical Engineering', 'Metallurgical Engineering'],
        expertise: ['Machine Learning', 'Computer Vision', 'Solar Microgrids', 'Agricultural Robotics'],
        researchAreas: ['Agri-Tech', 'Industrial Automation', 'Clean Energy'],
        contactEmail: 'incubation@nitjsr.ac.in'
      },
      {
        name: 'IIT (ISM) Dhanbad',
        location: 'Dhanbad, Jharkhand',
        district: 'Dhanbad',
        departments: ['Mining Engineering', 'Environmental Science', 'Computer Science'],
        expertise: ['Geospatial Analytics', 'Remote Sensing', 'Environmental Monitoring', 'Disaster Mitigation'],
        researchAreas: ['Mine Reclamation', 'Water Quality Analytics', 'Early Disaster Warning'],
        contactEmail: 'cie@iitism.ac.in'
      },
      {
        name: 'Ranchi University',
        location: 'Ranchi, Jharkhand',
        district: 'Ranchi',
        departments: ['Information Technology', 'Biotechnology', 'Sociology'],
        expertise: ['EdTech', 'Rural Livelihoods', 'Biotech Solutions'],
        researchAreas: ['Digital Inclusion', 'Community Healthcare'],
        contactEmail: 'itcell@ranchiuniversity.ac.in'
      },
      {
        name: 'Vinoba Bhave University (VBU)',
        location: 'Hazaribagh, Jharkhand',
        district: 'Hazaribagh',
        departments: ['Computer Science', 'Botany', 'Physics'],
        expertise: ['Soil Science', 'Renewable Energy', 'Local Governance Tech'],
        researchAreas: ['Rural Energy Grids', 'Agricultural Pathology'],
        contactEmail: 'vbu@hazaribagh.ac.in'
      }
    ]);

    const bitMesra = createdUniversities[0];
    const nitJsr = createdUniversities[1];
    const iitDhanbad = createdUniversities[2];

    console.log('🏭 Seeding Industry Partners...');
    const createdIndustries = await Industry.create([
      {
        name: 'Tata Steel CSR & Tech',
        industryType: 'Manufacturing & Steel Tech',
        location: 'Jamshedpur, Jharkhand',
        expertise: ['Hardware Procurement', 'CSR Funding', 'Scalable Manufacturing', 'Mentorship'],
        contactPerson: 'Mr. Arvind Swamy',
        contactEmail: 'industry@demo.com',
        user: industryUser._id
      },
      {
        name: 'Heavy Engineering Corp (HEC Ranchi)',
        industryType: 'Heavy Manufacturing & Engineering',
        location: 'Ranchi, Jharkhand',
        expertise: ['Mechanical Fabrication', 'Prototyping', 'Structural Testing'],
        contactPerson: 'Er. S. K. Singh',
        contactEmail: 'csr@hecltd.com'
      },
      {
        name: 'Jindal Steel Innovation Lab',
        industryType: 'Industrial Tech',
        location: 'Patratu, Ramgarh',
        expertise: ['Energy Efficiency', 'Field Testing Support', 'Seed Grants'],
        contactPerson: 'Dr. Meena Pandey',
        contactEmail: 'innovation@jindal.com'
      },
      {
        name: 'AgroTech Jharkhand Startup',
        industryType: 'Agri-Tech Startup',
        location: 'Ranchi, Jharkhand',
        expertise: ['Drone Spraying', 'Farm Software', 'Market Access'],
        contactPerson: 'Vikram Soren',
        contactEmail: 'contact@agrotechjh.in'
      },
      {
        name: 'GreenGrid Solar Solutions',
        industryType: 'Renewable Energy',
        location: 'Dhanbad, Jharkhand',
        expertise: ['Solar Photovoltaic Inverters', 'Battery Storage', 'Microgrid Deployment'],
        contactPerson: 'Pooja Anand',
        contactEmail: 'support@greengrid.in'
      }
    ]);

    console.log('🚨 Seeding Societal Problems...');
    const rawProblems = [
      {
        title: 'Drinking water shortage in Dumka village',
        description: 'Severe shortage of clean drinking water in village Panchayat of Dumka during peak summer months. Pipelines are damaged, groundwater levels are depleted, and over 1,200 villagers must walk 4km daily to collect unsafe well water.',
        category: 'Water Management',
        district: 'Dumka',
        urgency: 'High',
        affectedPopulation: 1200,
        location: { village: 'Kathikund Village, Dumka', latitude: 24.2676, longitude: 87.2479 },
        status: 'In Development',
        assignedUniversity: bitMesra._id
      },
      {
        title: 'Crop disease & yellow rust affecting paddy farmers',
        description: 'Farmers across rural Ranchi districts are facing sudden yellow rust and bacterial leaf blight destroying early paddy crops. Lack of early detection tool results in 40% yield loss.',
        category: 'Agriculture',
        district: 'Ranchi',
        urgency: 'High',
        affectedPopulation: 850,
        location: { village: 'Chanho Block, Ranchi', latitude: 23.4721, longitude: 85.0319 },
        status: 'Assigned',
        assignedUniversity: nitJsr._id
      },
      {
        title: 'Lack of digital education facilities in West Singhbhum',
        description: 'Over 15 primary tribal schools lack internet connectivity and digital learning modules, hindering STEM education for over 600 tribal children.',
        category: 'Education',
        district: 'West Singhbhum',
        urgency: 'Medium',
        affectedPopulation: 640,
        location: { village: 'Chaibasa Rural, West Singhbhum', latitude: 22.5539, longitude: 85.8078 },
        status: 'Submitted'
      },
      {
        title: 'Poor municipal solid waste management & open dumping',
        description: 'Unregulated dumping of household garbage near residential markets in Dhanbad creates severe health hazards and clogged monsoon storm drains.',
        category: 'Sanitation',
        district: 'Dhanbad',
        urgency: 'High',
        affectedPopulation: 3200,
        location: { village: 'Bankore Ward 12, Dhanbad', latitude: 23.7957, longitude: 86.4304 },
        status: 'Under Review'
      },
      {
        title: 'Primary healthcare accessibility issue in remote Simdega blocks',
        description: 'Maternal health centers in deep forest blocks of Simdega lack real-time vital monitoring and emergency tele-consultation with district medical officers.',
        category: 'Healthcare',
        district: 'Simdega',
        urgency: 'Critical',
        affectedPopulation: 2500,
        location: { village: 'Kolebira Block, Simdega', latitude: 22.6100, longitude: 84.6900 },
        status: 'Submitted'
      },
      {
        title: 'Subarnarekha river flash flood early warning monitoring',
        description: 'Unpredictable seasonal overflows of the Subarnarekha River repeatedly submerge low-lying agricultural fields and cause emergency evacuations without advance warning.',
        category: 'Environment',
        district: 'East Singhbhum',
        urgency: 'Critical',
        affectedPopulation: 14000,
        location: { village: 'Mango Sub-division, Jamshedpur', latitude: 22.8046, longitude: 86.2029 },
        status: 'In Development',
        assignedUniversity: iitDhanbad._id
      },
      {
        title: 'Solar microgrid power instability in Netarhat rural area',
        description: 'Existing off-grid solar panels suffer from power fluctuations and battery drainage, leaving health clinics in the dark during night emergencies.',
        category: 'Energy',
        district: 'Latehar',
        urgency: 'High',
        affectedPopulation: 1100,
        location: { village: 'Netarhat Plateau, Latehar', latitude: 23.4833, longitude: 84.2667 },
        status: 'Submitted'
      },
      {
        title: 'Public transport tracking & scheduling for rural commuters',
        description: 'Commuters and daily wage workers between Hazaribagh and rural outskirts have no access to reliable bus timetables or live tracking.',
        category: 'Urban Development',
        district: 'Hazaribagh',
        urgency: 'Low',
        affectedPopulation: 4500,
        location: { village: 'Pelawal Town, Hazaribagh', latitude: 23.9961, longitude: 85.3637 },
        status: 'Submitted'
      },
      {
        title: 'Automated plastic waste collection drive in Bokaro Steel City',
        description: 'Single-use plastic bottles pollute local lakes and water bodies around Bokaro Steel City due to absence of automated smart reverse-vending kiosks.',
        category: 'Sanitation',
        district: 'Bokaro',
        urgency: 'Medium',
        affectedPopulation: 5000,
        location: { village: 'Sector 4 Lake, Bokaro', latitude: 23.6693, longitude: 86.1511 },
        status: 'Deployed'
      },
      {
        title: 'High fluorosis contamination in Palamu groundwater wells',
        description: 'Groundwater in 8 villages of Palamu contains fluoride levels exceeding 3.5 mg/L, causing skeletal fluorosis among children. Low-cost community filtration is needed.',
        category: 'Water Management',
        district: 'Palamu',
        urgency: 'Critical',
        affectedPopulation: 2800,
        location: { village: 'Daltonganj Outer Block, Palamu', latitude: 24.0411, longitude: 84.0722 },
        status: 'Testing'
      }
    ];

    const createdProblems = [];

    for (const p of rawProblems) {
      const aiAnalysis = await analyzeProblem({ title: p.title, description: p.description, category: p.category });
      
      const prob = await Problem.create({
        ...p,
        aiAnalysis,
        images: ['https://images.unsplash.com/photo-1541888946425-d0fbb186c5f0?w=600&auto=format&fit=crop&q=60'],
        submittedBy: citizenUser._id,
        recommendedUniversities: [
          { universityId: bitMesra._id, name: bitMesra.name, matchScore: 92 },
          { universityId: nitJsr._id, name: nitJsr.name, matchScore: 87 },
          { universityId: iitDhanbad._id, name: iitDhanbad.name, matchScore: 74 }
        ]
      });
      createdProblems.push(prob);
    }

    console.log('🚀 Seeding Projects...');
    const waterProblem = createdProblems.find(p => p.title.includes('Dumka'));
    const cropProblem = createdProblems.find(p => p.title.includes('Crop disease'));

    const createdProjects = await Project.create([
      {
        problemId: waterProblem._id,
        universityId: bitMesra._id,
        title: 'Smart Water Monitoring System (Dumka)',
        description: 'An IoT-enabled solar-powered water level monitoring and automated filtration distribution system for Dumka village.',
        facultyMentor: { name: 'Dr. Raj Sharma', email: 'faculty@demo.com', department: 'CSE, BIT Mesra' },
        students: [
          { name: 'Rahul Kumar', email: 'rahul@student.demo', department: 'Computer Science', role: 'IoT Firmware Lead' },
          { name: 'Aman Singh', email: 'aman@student.demo', department: 'Electronics', role: 'Sensor Calibration' },
          { name: 'Priya Verma', email: 'priya@student.demo', department: 'Civil Engineering', role: 'Hydrological Field Survey' }
        ],
        industryPartners: [
          {
            industryId: createdIndustries[0]._id,
            name: createdIndustries[0].name,
            contributions: ['Hardware Sensors', 'Technical Mentorship', '₹1.5 Lakh Grant']
          }
        ],
        milestones: [
          { title: 'Problem Survey & Field Validation', description: 'Visited Dumka village site and mapped 4 drinking water points.', status: 'Completed', completedAt: new Date() },
          { title: 'System Design & Architecture', description: 'Finalized ESP32 microcontrollers, ultrasonic level sensors and cloud telemetry.', status: 'Completed', completedAt: new Date() },
          { title: 'Hardware Prototype Assembly', description: 'Assembled IP67 waterproof sensor enclosures.', status: 'Completed', completedAt: new Date() },
          { title: 'Field Pilot Testing', description: 'Installed pilot sensors at 2 village tanks in Dumka.', status: 'In Progress' },
          { title: 'Community Handover & Deployment', description: 'Train Gram Panchayat members to view dashboard alerts.', status: 'Pending' }
        ],
        progress: 65,
        status: 'Development',
        kanban: {
          todo: ['Cellular SIM Gateway Configuration', 'Gram Panchayat Training Manual'],
          inProgress: ['Ultrasonic Level Sensor Calibration', 'Web Alert Webhooks'],
          testing: ['Water Flow & Pressure Sensor Test'],
          completed: ['Dumka On-site Field Survey', 'ESP32 Firmware Architecture', 'Circuit Blueprint']
        },
        solutionProposal: 'Low-cost IoT sensors broadcast real-time water availability to local Gram Panchayat dashboard & send automatic SMS alerts when tank drops below 20%.',
        impact: {
          peopleBenefited: 1200,
          metrics: 'Water availability improved by +38%, waiting time reduced by -42%'
        }
      },
      {
        problemId: cropProblem._id,
        universityId: nitJsr._id,
        title: 'Agri-AI Paddy Rust Diagnostic App',
        description: 'Computer-vision powered Android application allowing farmers to photograph paddy leaves and receive instant fungicide spray remedies.',
        facultyMentor: { name: 'Dr. S. N. Prasad', email: 'snprasad@nitjsr.ac.in', department: 'Computer Applications' },
        students: [
          { name: 'Neha Kumari', email: 'neha@student.nitjsr', department: 'MCA', role: 'ML Model Trainer' },
          { name: 'Rohan Soren', email: 'rohan@student.nitjsr', department: 'Electrical', role: 'UI/UX Mobile Dev' }
        ],
        milestones: [
          { title: 'Leaf Disease Dataset Collection', status: 'Completed' },
          { title: 'Mobile Neural Network Training', status: 'In Progress' },
          { title: 'Farmer Field Trial', status: 'Pending' }
        ],
        progress: 45,
        status: 'Development',
        solutionProposal: 'Mobile app runs lightweight TensorFlow Lite model offline to identify yellow rust within 2 seconds.'
      }
    ]);

    console.log('🤝 Seeding Industry Partnership Requests...');
    await Partnership.create({
      projectId: createdProjects[0]._id,
      industryId: createdIndustries[0]._id,
      industryName: createdIndustries[0].name,
      contributions: ['Funding', 'Mentorship', 'Hardware Sensors'],
      message: 'Tata Steel CSR Foundation wishes to support this Dumka water initiative with ₹1.5 Lakhs hardware grant and expert mentors.',
      status: 'Accepted'
    });

    console.log('🔔 Seeding System Notifications...');
    await Notification.create([
      {
        recipientId: citizenUser._id,
        recipientRole: 'citizen',
        title: 'BIT Mesra accepted your challenge!',
        message: 'BIT Mesra Innovation Cell accepted your challenge "Drinking water shortage in Dumka village" and spawned a project.',
        link: `/projects/${createdProjects[0]._id}`
      },
      {
        recipientId: universityUser._id,
        recipientRole: 'university',
        title: 'Tata Steel Partnership Confirmed',
        message: 'Tata Steel CSR has partnered on "Smart Water Monitoring System (Dumka)".',
        link: `/projects/${createdProjects[0]._id}`
      }
    ]);

    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    console.log('🔑 DEMO ACCOUNTS (Password: password123):');
    console.log('  • Citizen:    citizen@demo.com');
    console.log('  • University: university@demo.com');
    console.log('  • Industry:   industry@demo.com');
    console.log('  • Government: government@demo.com');
    console.log('  • Faculty:    faculty@demo.com');
    console.log('  • Student:    student@demo.com');
    console.log('  • Admin:      admin@demo.com');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
