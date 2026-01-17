const activityMultipliers = {
  "1-2": 1.375,
  "3-4": 1.55,
  "5-7": 1.725
};

const goalAdjustments = {
  // Lightweight calorie deficit/surplus tuning.
  cutting: 0.85,
  recomp: 1.0,
  bulking: 1.12
};

export function estimateDailyCalories({ weightKg, heightCm, age, sex, activityFrequency, goal }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  const multiplier = activityMultipliers[activityFrequency] || 1.2;
  const goalMultiplier = goalAdjustments[goal] || 1.0;
  // Total daily calories based on BMR, activity, and goal adjustment.
  return Math.round(base * multiplier * goalMultiplier);
}
