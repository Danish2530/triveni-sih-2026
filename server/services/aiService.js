/**
 * Mock AI Service for Triveni (SIH 2026 PS 26043)
 * Analyzes problem titles & descriptions using rule-based/keyword classification algorithms.
 * Designed so that an OpenAI / Google Gemini / HuggingFace API client can easily be plugged in.
 */

const analyzeProblem = async ({ title = '', description = '', category = '' }) => {
  const text = `${title} ${description}`.toLowerCase();

  let detectedCategory = category || 'Other';
  let subcategory = 'General Analysis';
  let priority = 'MEDIUM';
  let skills = ['Data Analytics', 'Project Management'];
  let keywords = [];
  let estimatedImpact = '500 citizens';

  // Keyword extraction logic
  if (text.includes('water') || text.includes('drinking') || text.includes('pipeline') || text.includes('borewell') || text.includes('irrigation') || text.includes('aquifer') || text.includes('monsoon')) {
    detectedCategory = 'Water Management';
    subcategory = text.includes('drinking') || text.includes('pipeline') ? 'Drinking Water & Quality' : 'Agricultural Irrigation & Storage';
    priority = (text.includes('shortage') || text.includes('scarcity') || text.includes('contaminat') || text.includes('drought')) ? 'HIGH' : 'MEDIUM';
    skills = ['IoT', 'Civil Engineering', 'Water Resources', 'Sensors & Embedded Systems'];
    keywords = ['water shortage', 'drinking water', 'pipeline network', 'community tank', 'aquifer'];
    estimatedImpact = '1,200 villagers & households';
  } else if (text.includes('crop') || text.includes('farmer') || text.includes('pest') || text.includes('soil') || text.includes('agriculture') || text.includes('harvest') || text.includes('yield')) {
    detectedCategory = 'Agriculture';
    subcategory = text.includes('disease') || text.includes('pest') ? 'Crop Protection & Pathology' : 'Smart Farming & Soil Health';
    priority = text.includes('disease') || text.includes('loss') ? 'HIGH' : 'MEDIUM';
    skills = ['Agricultural Engineering', 'Computer Vision / AI', 'Soil Science', 'IoT Sensors'];
    keywords = ['crop health', 'farmer livelihood', 'soil moisture', 'pest management'];
    estimatedImpact = '850 farmers';
  } else if (text.includes('health') || text.includes('hospital') || text.includes('doctor') || text.includes('medicine') || text.includes('clinic') || text.includes('maternal') || text.includes('ambulance')) {
    detectedCategory = 'Healthcare';
    subcategory = text.includes('ambulance') || text.includes('emergency') ? 'Telemedicine & Emergency Response' : 'Primary Healthcare Access';
    priority = 'CRITICAL';
    skills = ['Telemedicine', 'Mobile App Development', 'Biomedical Devices', 'GIS Mapping'];
    keywords = ['rural healthcare', 'telemedicine', 'emergency response', 'maternal health'];
    estimatedImpact = '3,500 rural residents';
  } else if (text.includes('waste') || text.includes('garbage') || text.includes('plastic') || text.includes('recycle') || text.includes('sanitation') || text.includes('toilet') || text.includes('drain')) {
    detectedCategory = 'Sanitation';
    subcategory = text.includes('waste') ? 'Solid Waste Management' : 'Urban & Rural Drainage';
    priority = text.includes('block') || text.includes('hazard') ? 'HIGH' : 'MEDIUM';
    skills = ['Environmental Engineering', 'Smart Waste Monitoring', 'Biotechnology', 'Civic Tech'];
    keywords = ['waste segregation', 'recycling', 'sanitation', 'cleanliness'];
    estimatedImpact = '2,100 community members';
  } else if (text.includes('school') || text.includes('education') || text.includes('student') || text.includes('digital') || text.includes('literacy') || text.includes('teacher') || text.includes('classroom')) {
    detectedCategory = 'Education';
    subcategory = 'Digital Education & STEM Learning';
    priority = 'MEDIUM';
    skills = ['Educational Technology (EdTech)', 'Web & Mobile Dev', 'Content Digitization'];
    keywords = ['digital classroom', 'rural literacy', 'STEM kits', 'student engagement'];
    estimatedImpact = '640 students & youth';
  } else if (text.includes('solar') || text.includes('energy') || text.includes('grid') || text.includes('power') || text.includes('electricity') || text.includes('outage')) {
    detectedCategory = 'Energy';
    subcategory = 'Renewable Microgrids & Clean Energy';
    priority = text.includes('outage') || text.includes('blackout') ? 'HIGH' : 'MEDIUM';
    skills = ['Electrical Engineering', 'Solar Microgrid Architecture', 'Energy Management Systems'];
    keywords = ['solar power', 'rural electrification', 'energy storage', 'clean grid'];
    estimatedImpact = '950 households';
  } else if (text.includes('flood') || text.includes('disaster') || text.includes('river') || text.includes('warning') || text.includes('climate') || text.includes('landslide')) {
    detectedCategory = 'Environment';
    subcategory = 'Early Warning Systems & Climate Resilience';
    priority = 'CRITICAL';
    skills = ['Disaster Management', 'IoT Early Warning', 'GIS & Satellite Data', 'Data Analytics'];
    keywords = ['flood warning', 'disaster response', 'river level monitoring', 'climate resilience'];
    estimatedImpact = '15,000 citizens in flood zone';
  } else {
    // Default Fallback Keyword generation
    const words = text.split(/\s+/).filter(w => w.length > 4);
    keywords = Array.from(new Set(words)).slice(0, 5);
    if (priority === 'MEDIUM' && (text.includes('urgent') || text.includes('severe') || text.includes('immediate'))) {
      priority = 'HIGH';
    }
  }

  return {
    category: detectedCategory,
    subcategory,
    priority,
    skills,
    keywords,
    estimatedImpact,
    confidenceScore: 0.94,
    analyzedAt: new Date().toISOString()
  };
};

module.exports = {
  analyzeProblem
};
