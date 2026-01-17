export function buildRecipePrompt({ profile, ingredients, mealsCount, targetCalories }) {
  const ingredientList = ingredients
    .map((item) => `${item.name} ${item.amount}${item.unit || "g"}`)
    .join(", ");

  // Prompt asks for structured JSON the frontend can render.
  return `You are a nutrition-focused recipe planner for NUS hall residents.
Create ${mealsCount} meal ideas using only the provided ingredients plus basic sauces and garnishes (chilli, pepper, soy sauce, salt, oil, vinegar).
Prioritize post-training recovery with higher protein and carbs.
User profile: ${profile.sex}, ${profile.age}y, ${profile.weightKg}kg, activity ${profile.activityFrequency} days/week, goal ${profile.goal}.
Target daily calories based on goal: ~${targetCalories}.
Ingredients available: ${ingredientList}.
Give the time taken to cook this dish.
Give the serving size of the dish.
Do not put TBD or any empty placeholder.
Return JSON only with schema:
{ "meals": [ { "name": string, "description": string, "timeTakenMinutes": number, "servings": number, "ingredients": [string], "steps": [string], "estimatedMacros": { "protein_g": number, "carbs_g": number, "fat_g": number, "calories": number } } ] }
Steps must include cook times or visual cues (e.g., "boil pasta 8-10 min until al dente", "sear chicken 3-4 min per side until browned").
Estimated macros must include calories as a non-zero number.
timeTakenMinutes and servings must be non-zero numbers.`;
}
