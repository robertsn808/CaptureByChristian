// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { getErrorMessage } from "../utils/errorUtils";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Unhandled error:", err);

  res.status(500).json({
    error: "Server Error",
    details: getErrorMessage(err),
  });
}
