import jwt from "jsonwebtoken";
import type { UserRole } from "../generated/prisma/enums.ts";

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const signToken = (payload: JwtPayload) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET misconfigured");
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: "1d",
  });
};
