import { Hono } from "hono";
import {
  createCommentController,
  getCommentsController,
  getAllCommentsController,
  deleteCommentController,
  getCommentsByRecipeController,
  updateCommentController
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const commentRoute = new Hono();

commentRoute.get("/all", getAllCommentsController);
commentRoute.get("/:recipeId", getCommentsController);
commentRoute.get("/recipes/:id/comments", getCommentsByRecipeController);
commentRoute.post("/", authMiddleware, createCommentController);
commentRoute.delete("/:id", authMiddleware, deleteCommentController);
commentRoute.patch("/:id", authMiddleware, updateCommentController);

export { commentRoute };
