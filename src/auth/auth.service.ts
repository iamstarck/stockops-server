import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.ts";
import {
  createRefreshToken,
  deleteRefreshToken,
  findRefreshToken,
} from "./auth.repository.ts";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.ts";

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError("Refresh token required", StatusCodes.BAD_REQUEST);
  }

  const stored = await findRefreshToken(refreshToken);
  if (!stored) {
    throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
  }

  if (stored.expiresAt < new Date()) {
    await deleteRefreshToken(refreshToken);
    throw new AppError("Refresh token expired", StatusCodes.UNAUTHORIZED);
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    await deleteRefreshToken(refreshToken);
    throw new AppError("Expired refresh token", StatusCodes.UNAUTHORIZED);
  }

  const newAccess = signAccessToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
  });

  const newRefresh = signRefreshToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
  });

  await deleteRefreshToken(refreshToken);
  await createRefreshToken(newRefresh, payload.id);

  return { accessToken: newAccess, refreshToken: newRefresh };
};
