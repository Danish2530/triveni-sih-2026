import Industry from '../models/Industry.js';

export const matchIndustriesForProblem = async (problem) => {
  try {
    const industries = await Industry.find({});

    if (!industries || industries.length === 0) {
      return [];
    }

    const problemSkills = (problem.aiAnalysis && problem.aiAnalysis.skills) ? problem.aiAnalysis.skills : [];
    const problemCategory = problem.category || '';
    const problemDistrict = problem.district || '';

    const matched = industries.map(ind => {
      let score = 50;

      // Category/expertise overlap
      const matchesCategory = (ind.expertise || []).some(exp =>
        exp.toLowerCase().includes(problemCategory.toLowerCase()) ||
        problemCategory.toLowerCase().includes(exp.toLowerCase())
      );
      if (matchesCategory) score += 25;

      // Skill overlap (from AI analysis)
      let skillMatchCount = 0;
      problemSkills.forEach(skill => {
        const hasSkill = (ind.expertise || []).some(exp =>
          exp.toLowerCase().includes(skill.toLowerCase())
        );
        if (hasSkill) skillMatchCount++;
      });

      if (problemSkills.length > 0) {
        score += Math.min(20, Math.round((skillMatchCount / problemSkills.length) * 20));
      }

      // Location proximity bonus
      if (ind.location && ind.location.toLowerCase().includes(problemDistrict.toLowerCase())) {
        score += 5;
      }

      const matchScore = Math.min(98, Math.max(60, score));

      return {
        industryId: ind._id,
        name: ind.name,
        industryType: ind.industryType,
        location: ind.location,
        expertise: ind.expertise,
        matchScore
      };
    });

    matched.sort((a, b) => b.matchScore - a.matchScore);

    return matched;
  } catch (error) {
    console.error('Error in industry matching service:', error);
    return [];
  }
};

export default {
  matchIndustriesForProblem
};