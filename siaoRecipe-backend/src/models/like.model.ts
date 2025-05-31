import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const likeRecipe = async (userId: number, recipeId: number) => {
  return prisma.like.create({
    data: {
      userId,
      recipeId,
    },
  });
};


const unlikeRecipe = async (userId: number, recipeId: number) => {
  return prisma.like.delete({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });
};

const hasLikedRecipe = async (userId: number, recipeId: number) => {
  const like = await prisma.like.findUnique({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });
  return Boolean(like);
};

const getLikedRecipesByUser = async (userId: number) => {
  return prisma.like.findMany({
    where: { userId },
    include: {
      recipe: {
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });
};

const countLikesForRecipe = async (recipeId: number) => {
  return prisma.like.count({
    where: { recipeId },
  });
};

export {
  likeRecipe,
  unlikeRecipe,
  hasLikedRecipe,
  getLikedRecipesByUser,
  countLikesForRecipe,
};
