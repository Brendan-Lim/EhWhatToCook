import "dotenv/config";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import profileRoutes from "./routes/profile.js";
import recipeRoutes from "./routes/recipes.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/setup", profileRoutes);
app.use("/api/recipes", recipeRoutes);

app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
