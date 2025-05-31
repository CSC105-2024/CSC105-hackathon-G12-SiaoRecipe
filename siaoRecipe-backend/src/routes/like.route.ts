import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import {
  likeRecipeController,
  unlikeRecipeController,
  hasLikedRecipeController,
  getLikedRecipesByUserController,
  countLikesForRecipeController,
} from "../controllers/like.controller.js";

const likeRoute = new Hono();

likeRoute.post("/:recipeId", authMiddleware, likeRecipeController);
likeRoute.delete("/:recipeId", authMiddleware, unlikeRecipeController);
likeRoute.get("/:recipeId/has-liked", authMiddleware, hasLikedRecipeController); 
likeRoute.get("/user", authMiddleware, getLikedRecipesByUserController);
likeRoute.get("/:recipeId/count", countLikesForRecipeController);

export default likeRoute;
