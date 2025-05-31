import type { Context } from "hono";
import {
  createRecipe,
  findRecipeById,
  updateRecipe,
  deleteRecipe,
  filterRecipes,
  findRecipesByUserId
} from "../models/recipe.model.js";
import { Emotion } from "@prisma/client";

const createRecipeController = async (c: Context) => {
  const body = await c.req.json();
  const user = c.get("user");

  const recipe = await createRecipe({
    title: body.title,
    description: body.description,
    emotions: body.emotions,
    authorId: user.id,
  });

  return c.json(recipe);
};
const getMyRecipesController = async (c: Context) => {
  const user = c.get("user");
  const recipes = await findRecipesByUserId(user.id);
  return c.json(recipes);
};


const findRecipeByIdController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  const recipe = await findRecipeById(id);
  if (!recipe) return c.json({ error: "Not found" }, 404);
  return c.json(recipe);
};

const updateRecipeController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  const user = c.get("user");
  const data = await c.req.json();

  try {
    const updated = await updateRecipe(id, user.id, {
      title: data.title,
      description: data.description,
      emotions: data.emotion ? [data.emotion] : undefined,
    });
    return c.json(updated);
  } catch {
    return c.json({ error: "Unauthorized or not found" }, 403);
  }
};

const deleteRecipeController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  const user = c.get("user");

  try {
    await deleteRecipe(id, user.id);
    return c.json({ message: "Deleted" });
  } catch {
    return c.json({ error: "Unauthorized or not found" }, 403);
  }
};

const filterRecipesController = async (c: Context) => {
  const { title, username, emotion, popular, today } = c.req.query();
  const recipes = await filterRecipes({
    title,
    username,
    emotion: emotion ? (emotion as Emotion) : undefined,
    popular: popular === "true",
    today: today === "true",
  });
  return c.json(recipes);
};

export {
  createRecipeController,
  findRecipeByIdController,
  updateRecipeController,
  deleteRecipeController,
  filterRecipesController,
  getMyRecipesController

};
