import bcrypt from "bcryptjs";
import { findUserByEmailWithPassword } from "./user.repository.ts";
import { AppError } from "../utils/AppError.ts";
import { StatusCodes } from "http-status-codes";
import { signToken } from "../utils/jwt.ts";
import { userLoginSchema } from "../schemas/userSchemas.ts";
import type z from "zod";

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

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return { user: userResponse, token };
};
