import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "default-secret";

const generateToken = (
  payload: object,
  expiresIn: string = "7d"
) => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export { generateToken, verifyToken };
