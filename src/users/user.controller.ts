import type { Request, Response } from "express";
import { loginUser } from "./user.service.ts";
import { StatusCodes } from "http-status-codes";

export const userLoginController = async (req: Request, res: Response) => {
  const user = await loginUser(req.body);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Login success",
    data: user,
  });
};
