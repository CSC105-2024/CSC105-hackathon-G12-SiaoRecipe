import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createComment = (data: { recipeId: number; authorId: number; content: string }) => {
  return prisma.comment.create({
    data,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};


const getCommentsByRecipe = (recipeId: number) => {
  return prisma.comment.findMany({
    where: { recipeId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
};


const getAllComments = () => {
  return prisma.comment.findMany({
    include: {
      author: { select: { username: true } },
      recipe: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const deleteComment = (id: number, userId: number) => {
  return prisma.comment.deleteMany({
    where: {
      id,
      authorId: userId,
    },
  });
};

export {
  createComment,
  getCommentsByRecipe,
  getAllComments,
  deleteComment,
};
