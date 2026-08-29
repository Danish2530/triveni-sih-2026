/**
 * Duplicate Detection Service for Triveni
 */

import Problem from '../models/Problem.js';

const extractKeywords = (text) => {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
  );
};

const calculateJaccardSimilarity = (setA, setB) => {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  setA.forEach(item => {
    if (setB.has(item)) intersectionCount++;
  });
  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount === 0 ? 0 : (intersectionCount / unionCount);
};

export const checkForDuplicates = async ({ title, description, category, district }) => {
  try {
    const existingProblems = await Problem.find({ status: { $ne: 'Resolved' } }).limit(50);
    const newKeywords = extractKeywords(`${title} ${description}`);

    let highestSimilarity = 0;
    let mostSimilarProblem = null;

    for (const existing of existingProblems) {
      const existingKeywords = extractKeywords(`${existing.title} ${existing.description}`);
      let sim = calculateJaccardSimilarity(newKeywords, existingKeywords);

      if (existing.category === category) sim += 0.15;
      if (existing.district === district) sim += 0.10;

      const percentage = Math.min(99, Math.round(sim * 100));

      if (percentage > highestSimilarity) {
        highestSimilarity = percentage;
        mostSimilarProblem = existing;
      }
    }

    if (highestSimilarity >= 50 && mostSimilarProblem) {
      return {
        isDuplicate: true,
        similarityScore: highestSimilarity,
        existingProblem: {
          id: mostSimilarProblem._id,
          code: `#CH-${mostSimilarProblem._id.toString().slice(-4).toUpperCase()}`,
          title: mostSimilarProblem.title,
          category: mostSimilarProblem.category,
          district: mostSimilarProblem.district,
          status: mostSimilarProblem.status,
          submittedAt: mostSimilarProblem.createdAt
        }
      };
    }

    return {
      isDuplicate: false,
      similarityScore: highestSimilarity,
      existingProblem: null
    };
  } catch (error) {
    console.error('Error in duplicate detection service:', error);
    return { isDuplicate: false, similarityScore: 0 };
  }
};

export default {
  checkForDuplicates
};
