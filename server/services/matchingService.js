/**
 * University Matching Algorithm Service for Triveni
 * Matches submitted societal problems with the most suitable universities based on expertise,
 * research focus, department capabilities, and geographic proximity.
 */

const University = require('../models/University');

const matchUniversitiesForProblem = async (problem) => {
  try {
    const universities = await University.find({});
    
    if (!universities || universities.length === 0) {
      return [];
    }

    const problemSkills = (problem.aiAnalysis && problem.aiAnalysis.skills) ? problem.aiAnalysis.skills : [];
    const problemCategory = problem.category || '';
    const problemDistrict = problem.district || '';

    const matched = universities.map(uni => {
      let score = 50; // Base score for participating universities

      // Category match (up to +25 points)
      const matchesCategory = uni.expertise.some(exp => 
        exp.toLowerCase().includes(problemCategory.toLowerCase()) || 
        problemCategory.toLowerCase().includes(exp.toLowerCase())
      ) || uni.researchAreas.some(ra => 
        ra.toLowerCase().includes(problemCategory.toLowerCase())
      );
      if (matchesCategory) score += 25;

      // Skill overlap match (up to +20 points)
      let skillMatchCount = 0;
      problemSkills.forEach(skill => {
        const hasSkill = uni.expertise.some(exp => exp.toLowerCase().includes(skill.toLowerCase())) ||
                         uni.departments.some(dept => dept.toLowerCase().includes(skill.toLowerCase()));
        if (hasSkill) skillMatchCount++;
      });

      if (problemSkills.length > 0) {
        score += Math.min(20, Math.round((skillMatchCount / problemSkills.length) * 20));
      }

      // District / Proximity bonus (+5 points if in same district/region)
      if (uni.location.toLowerCase().includes(problemDistrict.toLowerCase()) || (uni.district && uni.district.toLowerCase() === problemDistrict.toLowerCase())) {
        score += 5;
      }

      // Ensure cap at 98% for realistic scoring
      const matchScore = Math.min(98, Math.max(60, score));

      return {
        universityId: uni._id,
        name: uni.name,
        location: uni.location,
        departments: uni.departments,
        expertise: uni.expertise,
        matchScore
      };
    });

    // Sort by highest match score
    matched.sort((a, b) => b.matchScore - a.matchScore);

    return matched;
  } catch (error) {
    console.error('Error in university matching service:', error);
    return [];
  }
};

module.exports = {
  matchUniversitiesForProblem
};
