import { asyncWrapper } from "./helpers/asyncWrapper";
import {
  notFoundResponse,
  HttpError,
  authenticationRequiredResponse,
} from "./helpers/errors";
import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.get("/debug", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).end("all fine!");
});

app.get(
  "/protected",
  asyncWrapper(async (req: Request, res: Response) => {
    throw authenticationRequiredResponse();
    return;
  })
);
// 1- path does't exist.
app.use("*", (req, res, next) => {
  next(notFoundResponse());
});

// express provide a special middleware to catch errors for us.
// it should be called in last thing in your app otherwise some errors can be slip.
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (err.code === StatusCodes.INTERNAL_SERVER_ERROR) console.log(err);

  res.status(err.code).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

// hanlding panics (uncaughtException) and grancifully shutdown
// the server and close all open connection

//Handle unhandled promise rejections.
process.on("unhandledRejection", (err: Error, promise: Promise<any>) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
  throw err;
});

// Handle programmer errors.
process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

// handle gracefully shutdown when terminating the server CTRL+C
process.on("SIGTERM", () => {
  console.log("TERMINATING THE SERVER! 💥 Shutting down...");
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("TERMINATING THE SERVER! 💥 Shutting down...");
  process.exit(1);
});
