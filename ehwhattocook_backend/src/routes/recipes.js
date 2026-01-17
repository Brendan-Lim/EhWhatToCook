import { Router } from "express";
import { recipeInputSchema } from "../schemas/recipes.js";
import { validate } from "../middleware/validate.js";
import { estimateDailyCalories } from "../services/calorie.js";
import { getOpenAIClient } from "../services/openaiClient.js";
import { buildRecipePrompt } from "../services/recipePrompt.js";
import { buildImagePrompt } from "../services/imagePrompt.js";

const router = Router();

function normalizeMeals(payload) {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const meals = Array.isArray(payload.meals) ? payload.meals : [];
  return meals.map((meal) => {
    const protein = Number.parseFloat(meal?.estimatedMacros?.protein_g) || 0;
    const carbs = Number.parseFloat(meal?.estimatedMacros?.carbs_g) || 0;
    const fat = Number.parseFloat(meal?.estimatedMacros?.fat_g) || 0;
    const calculatedCalories = Math.round(protein * 4 + carbs * 4 + fat * 9);
    const timeTakenMinutes =
      Number.parseFloat(
        meal?.timeTakenMinutes ??
          meal?.time_taken_minutes ??
          meal?.time_taken ??
          meal?.timeTaken ??
          meal?.time_minutes
      ) || 0;
    const servings =
      Number.parseFloat(
        meal?.servings ?? meal?.servingSize ?? meal?.serving_size ?? meal?.servingsCount
      ) || 0;

    return {
      name: meal?.name || "Untitled meal",
      description: meal?.description || "",
      timeTakenMinutes,
      servings,
      ingredients: Array.isArray(meal?.ingredients) ? meal.ingredients : [],
      steps: Array.isArray(meal?.steps)
        ? meal.steps.map((step) => `${step}\n\n\n\n\n`)
        : [],
      estimatedMacros: {
        protein_g: protein,
        carbs_g: carbs,
        fat_g: fat,
        calories: calculatedCalories
      }
    };
  });
}

async function generateMealImage(client, meal) {
  const prompt = buildImagePrompt({
    name: meal.name,
    description: meal.description
  });

  const response = await client.images.generate({
    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
    prompt,
    size: "1024x1024",
    response_format: "url"
  });

  const image = response.data?.[0];
  if (image?.url) {
    return { imageUrl: image.url, imageError: null };
  }
  if (image?.b64_json) {
    return { imageUrl: `data:image/png;base64,${image.b64_json}`, imageError: null };
  }
  return { imageUrl: null, imageError: "No image returned by model." };
}

router.post("/generate", validate(recipeInputSchema), async (req, res, next) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      const error = new Error("OPENAI_API_KEY is not configured");
      error.status = 500;
      error.expose = true;
      throw error;
    }

    const { body } = req.validated;
    const targetCalories = estimateDailyCalories(body.profile);

    const client = getOpenAIClient();
    const prompt = buildRecipePrompt({
      profile: body.profile,
      ingredients: body.ingredients,
      mealsCount: body.mealsCount,
      targetCalories
    });

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4
    });

    const content = response.choices?.[0]?.message?.content || "";
    let parsed = null;

    try {
      const cleaned = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      parsed = { raw: content };
    }

    const meals = normalizeMeals(parsed);
    const recipes = await Promise.all(
      meals.map(async (meal) => {
        try {
          const { imageUrl, imageError } = await generateMealImage(client, meal);
          return { ...meal, imageUrl, imageError };
        } catch (imageError) {
          console.error("Image generation failed:", imageError);
          return {
            ...meal,
            imageUrl: null,
            imageError: imageError?.message || "Image generation failed."
          };
        }
      })
    );

    res.json({
      targetCalories,
      recipes,
      raw: parsed?.raw || null
    });
  } catch (err) {
    next(err);
  }
});

export default router;
