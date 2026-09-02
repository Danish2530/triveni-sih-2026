/**
 * Impact Score Engine for Triveni (SIH 2026 PS 26043)
 *
 * Deterministic, explainable scoring — NOT a black-box ML model.
 * Combines urgency, affected population, duplicate-report volume,
 * time-unresolved, and category seasonality into:
 *   - a 0-100 impact score
 *   - a 30/90/180-day "if nobody solves this" projection
 *
 * Every number the engine produces can be traced back to a factor,
 * which is the whole point: judges can ask "why 87?" and get an answer.
 */

// Urgency -> base severity weight (0-40 of the 100-point score)
const URGENCY_WEIGHTS = {
  Low: 10,
  Medium: 20,
  High: 30,
  Critical: 40
};

// Category -> seasonal growth multiplier applied to the projection curve.
// Rough, explainable heuristics — not claimed to be predictive ML.
const SEASONALITY_MULTIPLIERS = {
  'Water Management': 1.35,   // scarcity compounds toward summer
  'Agriculture': 1.25,        // crop-cycle dependent
  'Healthcare': 1.15,         // fairly constant, slight compounding
  'Sanitation': 1.10,
  'Environment': 1.30,        // flood/disaster-type risk compounds fast
  'Energy': 1.10,
  'Education': 1.05,          // slow-moving
  'Urban Development': 1.10,
  'Accessibility': 1.05,
  'Public Administration': 1.00,
  'Rural Livelihoods': 1.15,
  'Other': 1.05
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * @param {Object} problem - a Problem document (or plain object) with
 *   urgency, affectedPopulation, category, createdAt
 * @param {Number} duplicateCount - number of other reports linked to this
 *   one via duplicateOf (i.e. how many citizens reported the same issue)
 * @returns {Object} impact block matching the Problem.impact schema shape
 */
export const computeImpact = ({ urgency, affectedPopulation, category, createdAt }, duplicateCount = 0) => {
  const baseAffected = affectedPopulation || 500;
  const daysUnresolved = createdAt
    ? Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // --- Factor 1: Severity (from urgency) — max 40 points
  const severityWeight = URGENCY_WEIGHTS[urgency] ?? URGENCY_WEIGHTS.Medium;

  // --- Factor 2: Duplicate volume — how many citizens independently
  // reported the same underlying issue. Max 25 points, diminishing returns.
  const duplicateWeight = clamp(Math.round(Math.log2(duplicateCount + 1) * 10), 0, 25);

  // --- Factor 3: Urgency-population combination — max 20 points
  // Bigger affected population pushes score up, log-scaled so a single
  // huge number can't dominate the whole thing.
  const urgencyWeight = clamp(Math.round(Math.log10(baseAffected + 1) * 6), 0, 20);

  // --- Factor 4: Time unresolved — max 15 points
  // A problem sitting unresolved for a long time is scored as more urgent,
  // capped so very old stale demo data doesn't max this out unfairly.
  const timeWeight = clamp(Math.round((daysUnresolved / 60) * 15), 0, 15);

  const rawScore = severityWeight + duplicateWeight + urgencyWeight + timeWeight;
  const score = clamp(rawScore, 0, 100);

  // --- Projection curve ---
  // Growth compounds monthly using the category's seasonality multiplier,
  // scaled down so it reads as a gradual curve rather than exponential blowup.
  const seasonalityMultiplier = SEASONALITY_MULTIPLIERS[category] ?? SEASONALITY_MULTIPLIERS.Other;
  const monthlyGrowthRate = (seasonalityMultiplier - 1) / 2; // spread the multiplier's effect across the growth steps

  const currentAffected = baseAffected + duplicateCount * Math.round(baseAffected * 0.15);
  const projected30d = Math.round(currentAffected * (1 + monthlyGrowthRate * 1));
  const projected90d = Math.round(currentAffected * (1 + monthlyGrowthRate * 3));
  const projected180d = Math.round(currentAffected * (1 + monthlyGrowthRate * 6));

  const explanation = buildExplanation({
    category,
    urgency,
    duplicateCount,
    daysUnresolved,
    seasonalityMultiplier
  });

  return {
    score,
    currentAffected,
    projected30d,
    projected90d,
    projected180d,
    duplicateCount,
    factors: {
      severityWeight,
      duplicateWeight,
      urgencyWeight,
      timeWeight,
      seasonalityMultiplier
    },
    explanation,
    computedAt: new Date()
  };
};

const buildExplanation = ({ category, urgency, duplicateCount, daysUnresolved, seasonalityMultiplier }) => {
  const parts = [];

  if (duplicateCount > 0) {
    parts.push(`${duplicateCount} other citizen report${duplicateCount > 1 ? 's' : ''} of the same issue`);
  }
  if (urgency === 'Critical' || urgency === 'High') {
    parts.push(`${urgency.toLowerCase()} urgency rating`);
  }
  if (daysUnresolved > 30) {
    parts.push(`unresolved for ${daysUnresolved} days`);
  }
  if (seasonalityMultiplier > 1.2) {
    parts.push(`${category} issues tend to compound seasonally if left unresolved`);
  }

  if (parts.length === 0) {
    return 'Impact projection based on reported population and category baseline.';
  }

  return `Projection driven by: ${parts.join('; ')}.`;
};

export default {
  computeImpact
};