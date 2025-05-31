import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import {
  createRecipeController,
  findRecipeByIdController,
  updateRecipeController,
  deleteRecipeController,
  filterRecipesController,
  getMyRecipesController
} from "../controllers/recipe.controller.js";

const recipeRoute = new Hono();

recipeRoute.post("/", authMiddleware, createRecipeController);
recipeRoute.get("/:id", findRecipeByIdController);
recipeRoute.patch("/:id", authMiddleware, updateRecipeController);
recipeRoute.delete("/:id", authMiddleware, deleteRecipeController);
recipeRoute.get("/", filterRecipesController);
recipeRoute.get("/users/me/recipes", authMiddleware, getMyRecipesController);


export default recipeRoute;
