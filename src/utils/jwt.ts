import jwt from "jsonwebtoken";
import type { UserRole } from "../generated/prisma/enums.ts";

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const signAccessToken = (payload: JwtPayload) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET misconfigured");
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: "15m",
  });
};

export const signRefreshToken = (payload: JwtPayload) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET misconfigured");
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET misconfigured");
  }

  return jwt.verify(token, secret) as JwtPayload;
};
