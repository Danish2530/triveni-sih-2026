/**
 * University Matching Algorithm Service for Triveni
 */

import University from '../models/University.js';

export const matchUniversitiesForProblem = async (problem) => {
  try {
    const universities = await University.find({});
    
    if (!universities || universities.length === 0) {
      return [];
    }

    const problemSkills = (problem.aiAnalysis && problem.aiAnalysis.skills) ? problem.aiAnalysis.skills : [];
    const problemCategory = problem.category || '';
    const problemDistrict = problem.district || '';

    const matched = universities.map(uni => {
      let score = 50;

      const matchesCategory = uni.expertise.some(exp => 
        exp.toLowerCase().includes(problemCategory.toLowerCase()) || 
        problemCategory.toLowerCase().includes(exp.toLowerCase())
      ) || uni.researchAreas.some(ra => 
        ra.toLowerCase().includes(problemCategory.toLowerCase())
      );
      if (matchesCategory) score += 25;

      let skillMatchCount = 0;
      problemSkills.forEach(skill => {
        const hasSkill = uni.expertise.some(exp => exp.toLowerCase().includes(skill.toLowerCase())) ||
                         uni.departments.some(dept => dept.toLowerCase().includes(skill.toLowerCase()));
        if (hasSkill) skillMatchCount++;
      });

      if (problemSkills.length > 0) {
        score += Math.min(20, Math.round((skillMatchCount / problemSkills.length) * 20));
      }

      if (uni.location.toLowerCase().includes(problemDistrict.toLowerCase()) || (uni.district && uni.district.toLowerCase() === problemDistrict.toLowerCase())) {
        score += 5;
      }

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

    matched.sort((a, b) => b.matchScore - a.matchScore);

    return matched;
  } catch (error) {
    console.error('Error in university matching service:', error);
    return [];
  }
};

export default {
  matchUniversitiesForProblem
};
