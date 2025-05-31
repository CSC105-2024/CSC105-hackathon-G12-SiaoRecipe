import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const createUser = async (data: {
  username: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
    },
  });
};

const findUsers = async () => prisma.user.findMany({
  select: {
    id: true,
    username: true,
    createdAt: true,
  },
});

const findUserById = async (id: number) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });

const findUserByUsername = async (username: string) =>
  prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      password: true, 
    },
  });

const updateUser = async (
  id: number,
  data: Partial<{ username: string; password: string }>
) => {
  const updateData: any = { ...data };

  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    updateData.password = hashedPassword;
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
};

const removeUser = async (id: number) => prisma.user.delete({ where: { id } });

export {
  createUser,
  findUsers,
  findUserById,
  findUserByUsername,
  updateUser,
  removeUser,
};
