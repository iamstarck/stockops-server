import type { Request, Response } from "express";
import { loginUser } from "./user.service.ts";
import { StatusCodes } from "http-status-codes";

export const userLoginController = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Login success",
    data: { user, accessToken },
  });
};
