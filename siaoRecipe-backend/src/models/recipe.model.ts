import { PrismaClient, Emotion } from "@prisma/client";

const prisma = new PrismaClient();

const createRecipe = async (data: {
  title: string;
  description: string;
  emotions: Emotion[];
  authorId: number;
}) => {
  return prisma.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      authorId: data.authorId,
      emotions: {
        create: data.emotions.map((emotion) => ({ emotion })),
      },
    },
    include: {
      emotions: true,
      author: true, 
      _count: {     
        select: {
          comments: true,
        },
      },
    },
  });
};
const findRecipesByUserId = async (userId: number) => {
  return prisma.recipe.findMany({
    where: {
      authorId: userId,
    },
    include: {
      emotions: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      likes: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findRecipeById = async (id: number) => {
  return prisma.recipe.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      likes: true,           
      emotions: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
};


const updateRecipe = async (
  id: number,
  userId: number,
  data: Partial<{
    title: string;
    description: string;
    emotions: Emotion[];
  }>
) => {
  const existing = await prisma.recipe.findUnique({ where: { id } });
  if (!existing || existing.authorId !== userId) {
    throw new Error("Unauthorized");
  }

  const updateData: any = {};
  if (data.title) updateData.title = data.title;
  if (data.description) updateData.description = data.description;

  if (data.emotions) {
    await prisma.recipeEmotion.deleteMany({ where: { recipeId: id } });
    updateData.emotions = {
      create: data.emotions.map((emotion) => ({ emotion })),
    };
  }

  return prisma.recipe.update({
    where: { id },
    data: updateData,
    include: {
      emotions: true,
    },
  });
};

const deleteRecipe = async (id: number, userId: number) => {
  const existing = await prisma.recipe.findUnique({ where: { id } });
  if (!existing || existing.authorId !== userId) {
    throw new Error("Unauthorized");
  }
  return prisma.recipe.delete({ where: { id } });
};

const filterRecipes = async (filter: {
  title?: string;
  username?: string;
  emotion?: Emotion;
  popular?: boolean;
  today?: boolean; 
}) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return prisma.recipe.findMany({
    where: {
      title: filter.title ? { contains: filter.title } : undefined,
      emotions: filter.emotion
        ? {
            some: {
              emotion: filter.emotion,
            },
          }
        : undefined,
      author: filter.username
        ? { username: { contains: filter.username } }
        : undefined,
      createdAt: filter.today
        ? {
            gte: startOfToday,
            lte: endOfToday,
          }
        : undefined,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      likes: true,
      emotions: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: filter.popular ? { likes: { _count: "desc" } } : undefined,
  });
};

export {
  createRecipe,
  findRecipeById,
  updateRecipe,
  deleteRecipe,
  filterRecipes,
  findRecipesByUserId
};
