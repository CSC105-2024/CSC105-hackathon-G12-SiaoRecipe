import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";

const userRoute = new Hono();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.post("/logout", authMiddleware, logoutUser);
userRoute.get("/", authMiddleware, getUsers);
userRoute.get("/me", authMiddleware, getCurrentUser);
userRoute.get("/:id", authMiddleware, getUserById);
userRoute.patch("/:id", authMiddleware, updateUserController);
userRoute.delete("/:id", authMiddleware, deleteUserController);

export default userRoute;
