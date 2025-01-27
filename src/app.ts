import * as express from "express";
import * as cookieparser from "cookie-parser";

export const app = express();

// middlewares
app.use(express.json());
app.use(cookieparser());

// routes
import { userRouter } from "./routes/users.routes";
import { authRouter } from "./routes/auth.routes";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

// custom middleware
import { notFound, errorHandler } from "./middleware/errorHandler.middleware";
import cookieParser = require("cookie-parser");

app.use(notFound);
app.use(errorHandler);
