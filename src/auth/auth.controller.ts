import type { Request, Response } from "express";
import { refreshTokenService } from "./auth.service.ts";
import { StatusCodes } from "http-status-codes";

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refershToken;

  const { accessToken, refreshToken: newRefresh } =
    await refreshTokenService(refreshToken);

  res.cookie("refreshToken", newRefresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    accessToken,
  });
};
