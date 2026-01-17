import { z } from "zod";
import { activityFrequencyEnum, goalEnum } from "./profile.js";

// Ingredient amounts provided by the user.
const ingredientSchema = z.object({
  name: z.string().min(1).max(80),
  amount: z.number().positive(),
  unit: z.string().min(1).max(10).default("g")
});

// Profile snapshot required for recipe generation.
const profileSchema = z.object({
  weightKg: z.number().positive(),
  heightCm: z.number().positive(),
  age: z.number().int().positive(),
  sex: z.enum(["male", "female"]),
  activityFrequency: activityFrequencyEnum,
  goal: goalEnum
});

export const recipeInputSchema = z.object({
  body: z.object({
    profile: profileSchema,
    ingredients: z.array(ingredientSchema).min(1),
    // Number of meal options to return from the model.
    mealsCount: z.number().int().min(1).max(5).default(3)
  })
});
