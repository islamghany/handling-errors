"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRequiredResponse = exports.notFoundResponse = exports.serverErrorResponse = exports.errorResponse = exports.HttpError = void 0;
const http_status_codes_1 = require("http-status-codes");
class HttpError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
const err = new HttpError("heelo", 505);
const errorResponse = (message, code) => new HttpError(message, code);
exports.errorResponse = errorResponse;
const serverErrorResponse = (err) => (0, exports.errorResponse)("the server encountered a problem and could not process your request", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
exports.serverErrorResponse = serverErrorResponse;
const notFoundResponse = () => (0, exports.errorResponse)("the requested resource could not be found", http_status_codes_1.StatusCodes.NOT_FOUND);
exports.notFoundResponse = notFoundResponse;
const authenticationRequiredResponse = () => (0, exports.errorResponse)("you must be authenticated to access this resource", http_status_codes_1.StatusCodes.UNAUTHORIZED);
exports.authenticationRequiredResponse = authenticationRequiredResponse;
