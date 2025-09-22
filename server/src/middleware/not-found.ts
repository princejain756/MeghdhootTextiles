import { Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
}
