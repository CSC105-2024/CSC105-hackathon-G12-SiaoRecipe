import type { Context } from "hono";
import {
  createComment,
  getCommentsByRecipe,
  getAllComments,
  deleteComment,
} from "../models/comment.model.js";

const createCommentController = async (c: Context) => {
  const user = c.get("user");
  const { content, recipeId } = await c.req.json();

  const comment = await createComment({
    content,
    recipeId,
    authorId: user.id,
  });

  return c.json(comment);
};
const getCommentsByRecipeController = async (c: Context) => {
  const recipeId = parseInt(c.req.param("id"));
  const comments = await getCommentsByRecipe(recipeId);
  return c.json(comments);
};

const getCommentsController = async (c: Context) => {
  const recipeId = parseInt(c.req.param("recipeId"));
  const comments = await getCommentsByRecipe(recipeId);
  return c.json(comments);
};

const getAllCommentsController = async (c: Context) => {
  const comments = await getAllComments();
  return c.json(comments);
};

const deleteCommentController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  const user = c.get("user");

  const deleted = await deleteComment(id, user.id);
  if (deleted.count === 0) {
    return c.json({ error: "Not found or unauthorized" }, 403);
  }

  return c.json({ message: "Comment deleted" });
};

export {
  createCommentController,
  getCommentsController,
  getAllCommentsController,
  deleteCommentController,
  getCommentsByRecipeController
};
