import type { Context } from "hono";
import {
  createComment,
  getCommentsByRecipe,
  getAllComments,
  deleteComment,
  updateComment
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

const updateCommentController = async (c: Context) => {
  const id = Number(c.req.param("id")); 
  const { content } = await c.req.json(); 
  const userId = c.get("user").id; 

  const result = await updateComment(id, userId, content);

  if (result.count === 0) {
    return c.json({ error: "Comment not found or unauthorized" }, 403);
  }

  return c.json({ success: true, message: "Comment updated" });
};


export {
  createCommentController,
  getCommentsController,
  getAllCommentsController,
  deleteCommentController,
  getCommentsByRecipeController,
  updateCommentController
};
