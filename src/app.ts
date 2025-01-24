import * as express from "express";
import { Request, Response } from "express";

export const app = express();

// middlewares
app.use(express.json());

// routes
import { userRouter } from "./routes/users.routes";

app.use("/api/v1/users", userRouter);
