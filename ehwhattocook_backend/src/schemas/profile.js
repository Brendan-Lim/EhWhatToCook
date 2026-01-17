import { z } from "zod";

export const activityFrequencyEnum = z.enum(["1-2", "3-4", "5-7"]);
export const goalEnum = z.enum(["cutting", "recomp", "bulking"]);

export const profileInputSchema = z.object({
  body: z.object({
    weightKg: z.number().positive(),
    heightCm: z.number().positive(),
    age: z.number().int().positive(),
    sex: z.enum(["male", "female"]),
    // Workout frequency bracket used for calorie estimation.
    activityFrequency: activityFrequencyEnum,
    // Goal influences calorie adjustment for meal targets.
    goal: goalEnum
  })
});
