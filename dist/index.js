"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncWrapper_1 = require("./helpers/asyncWrapper");
const errors_1 = require("./helpers/errors");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get("/debug", (req, res, next) => {
    res.status(200).end("all fine!");
});
app.get("/protected", (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw (0, errors_1.authenticationRequiredResponse)();
    return;
})));
// 1- path does't exist.
app.use("*", (req, res, next) => {
    next((0, errors_1.notFoundResponse)());
});
// express provide a special middleware to catch errors for us.
// it should be called in last thing in your app otherwise some errors can be slip.
app.use((err, req, res, next) => {
    if (err.code === http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        console.log(err);
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
process.on("unhandledRejection", (err, promise) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    process.exit(1);
    throw err;
});
// Handle programmer errors.
process.on("uncaughtException", (err) => {
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
