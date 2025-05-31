import { verifyToken } from "../utils/jwt.js";
import { getCookie } from "hono/cookie";
import type { MiddlewareHandler } from "hono";

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const decoded = verifyToken(token);
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
};

export { authMiddleware };
