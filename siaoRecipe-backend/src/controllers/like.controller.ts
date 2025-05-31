import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";

const prisma = new PrismaClient();

const likeRecipeController = async (c: Context) => {
  const user = c.get("user");
  const recipeId = parseInt(c.req.param("recipeId"));

  const existing = await prisma.like.findUnique({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId,
      },
    },
  });

  if (existing) {
    return c.json({ message: "Already liked" }, 409);
  }

  const like = await prisma.like.create({
    data: {
      userId: user.id,
      recipeId,
    },
  });

  return c.json({ message: "Recipe liked", like });
};

const unlikeRecipeController = async (c: Context) => {
  const user = c.get("user");
  const recipeId = parseInt(c.req.param("recipeId"));

  const existing = await prisma.like.findUnique({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId,
      },
    },
  });

  if (!existing) {
    return c.json({ message: "Like not found" }, 404);
  }

  await prisma.like.delete({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId,
      },
    },
  });

  return c.json({ message: "Recipe unliked" });
};

const hasLikedRecipeController = async (c: Context) => {
  const user = c.get("user");
  const recipeId = parseInt(c.req.param("recipeId"));

  const like = await prisma.like.findUnique({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId,
      },
    },
  });

  return c.json({ liked: Boolean(like) });
};

const getLikedRecipesByUserController = async (c: Context) => {
  const user = c.get("user");

  const likes = await prisma.like.findMany({
    where: { userId: user.id },
    include: {
      recipe: {
        include: {
          author: { select: { username: true } },
          emotions: true,
          likes: true,
          _count: {
            select: { comments: true },
          },
        },
      },
    },
  });

  // ✅ Return เฉพาะ recipe พร้อมข้อมูลครบ
  return c.json(likes.map((like) => like.recipe));
};

const countLikesForRecipeController = async (c: Context) => {
  const recipeId = parseInt(c.req.param("recipeId"));

  const count = await prisma.like.count({
    where: { recipeId },
  });

  return c.json({ recipeId, count });
};

export {
  likeRecipeController,
  unlikeRecipeController,
  hasLikedRecipeController,
  getLikedRecipesByUserController,
  countLikesForRecipeController,
};
