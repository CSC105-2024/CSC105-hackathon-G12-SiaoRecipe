import { createUser, findUsers, findUserById, findUserByUsername, updateUser, removeUser } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import type { Context } from "hono";

const registerUser = async (c: Context) => {
  try {
    const { username, password } = await c.req.json();

    const existing = await findUserByUsername(username);
    if (existing) {
      return c.json({ error: "Username already taken" }, 400);
    }

    const user = await createUser({ username, password });
    return c.json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Register Error:", err);
    return c.json({ error: "Registration failed" }, 500);
  }
};

const loginUser = async (c: Context) => {
  try {
    const { username, password, rememberMe } = await c.req.json();

    const user = await findUserByUsername(username);
    if (!user) return c.json({ error: "User not found" }, 404);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return c.json({ error: "Invalid credentials" }, 401);

    const expiresIn = rememberMe ? "30d" : "2h";
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 2;
    const token = generateToken({ id: user.id, username: user.username }, expiresIn);

    c.header("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`);
    return c.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    return c.json({ error: "Login failed" }, 500);
  }
};

const logoutUser = async (c: Context) => {
  c.header("Set-Cookie", `token=; HttpOnly; Path=/; Max-Age=0`);
  return c.json({ message: "Logged out successfully" });
};

const getUsers = async (c: Context) => {
  const users = await findUsers();
  return c.json(users);
};

const getUserById = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  const user = await findUserById(id);
  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json(user);
};

const getCurrentUser = async (c: Context) => {
  const payload = c.get("user");
  const user = await findUserById(payload.id);
  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json(user);
};

const updateUserController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  if (body.password) body.password = await bcrypt.hash(body.password, 10);
  const updatedUser = await updateUser(id, body);
  return c.json({ message: "User updated", updatedUser });
};

const deleteUserController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  await removeUser(id);
  return c.json({ message: "User deleted" });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserController,
  deleteUserController,
};
