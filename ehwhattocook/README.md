# EhWhatToCook

EhWhatToCook is a lightweight web app that turns whatever is in your fridge into
personalized, nutrition-aware meal ideas. It combines a simple ingredient
capture flow with profile-based calorie targets so users can cook faster,
reduce food waste, and stay aligned with fitness goals.

## What It Does

- Accepts ingredients you already have on hand.
- Uses your profile (age, weight, activity level, goal) to estimate daily
  calories and generate meals that match your target.
- Produces recipes with steps, estimated macros, and serving/time details.
- Optionally generates a top-down clipart image for each dish.

## Why It Helps

- Cuts down decision fatigue when you do not know what to cook.
- Helps students and busy users build meals around real pantry constraints.
- Aligns meals to cutting, recomp, or bulking goals without extra tracking apps.

## Tech Stack

- Frontend: React + Vite, Bootstrap styling.
- Backend: Express.js API with Zod validation.
- AI: OpenAI for recipe generation and optional image generation.

## Screenshots

![Home screen](public/mainpage.png)
![Ingredient input and profile](public/recipe1.jpg)
![Branding](public/logo.png)

## Local Development

### Frontend

```bash
cd ehwhattocook
npm install
npm run dev
```

### Backend

```bash
cd ehwhattocook_backend
npm install
npm run dev
```

Create `ehwhattocook_backend/.env` with:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_IMAGE_MODEL=dall-e-2
PORT=3000
```

The frontend proxies `/api` to the backend in development.
