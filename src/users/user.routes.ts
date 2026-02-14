import express from "express";
import { userLoginController } from "./user.controller.ts";
import { validateData } from "../middlewares/vailidationMiddleware.ts";
import { userLoginSchema } from "../schemas/userSchemas.ts";

const router = express.Router();

router.post("/login", validateData(userLoginSchema), userLoginController);

export default router;
