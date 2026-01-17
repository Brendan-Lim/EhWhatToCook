import { Router } from "express";
import { profileInputSchema } from "../schemas/profile.js";
import { validate } from "../middleware/validate.js";
import { estimateDailyCalories } from "../services/calorie.js";

const router = Router();

router.post("/profile", validate(profileInputSchema), (req, res) => {
  const { body } = req.validated;
  // Estimate daily calories for the user's stated goal and activity level.
  const dailyCalories = estimateDailyCalories(body);

  res.json({
    profile: body,
    calorieEstimate: {
      dailyCalories,
      // Reference method so the frontend can label it.
      method: "mifflin-st-jeor"
    }
  });
});

export default router;
