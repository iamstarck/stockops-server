import bcrypt from "bcryptjs";
import { findUserByEmailWithPassword } from "./user.repository.ts";
import { AppError } from "../utils/AppError.ts";
import { StatusCodes } from "http-status-codes";
import { signAccessToken, signRefreshToken } from "../utils/jwt.ts";
import { userLoginSchema } from "../schemas/userSchemas.ts";
import type z from "zod";
import { createRefreshToken } from "../auth/auth.repository.ts";
import { hashToken } from "../auth/auth.service.ts";

type UserLoginInput = z.infer<typeof userLoginSchema>;

export const loginUser = async (userData: UserLoginInput) => {
  const user = await findUserByEmailWithPassword(userData.email);

  if (!user) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  const isPasswordMatch = await bcrypt.compare(
    userData.password,
    user.password,
  );

  if (!isPasswordMatch) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const hashedRefreshToken = hashToken(refreshToken);

  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  await createRefreshToken(hashedRefreshToken, user.id);

  return { user: userResponse, accessToken, refreshToken };
};
