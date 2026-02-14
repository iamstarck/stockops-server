import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import userRouter from "./users/user.routes.ts";
import { errorHandler } from "./middlewares/errorHandler.middleware.ts";
import { prisma } from "./lib/prisma.ts";
import { StatusCodes } from "http-status-codes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("Backend is running");
});

app.use((req: Request, res: Response) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment variables");
}

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to Prisma");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting to Prisma", error.message);
      process.exit(1);
    }
  }
};

startServer();
