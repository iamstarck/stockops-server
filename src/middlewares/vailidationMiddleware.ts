import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type z from "zod";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.ts";

export const validateData = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new AppError(
          err.issues.map((i) => i.message).join(", "),
          StatusCodes.BAD_REQUEST,
        );
      }

      next(err);
    }
  };
};
