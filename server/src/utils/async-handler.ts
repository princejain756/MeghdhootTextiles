import type { RequestHandler } from "express";

export const asyncHandler = <TRequest extends RequestHandler>(handler: TRequest): RequestHandler => {
  return (async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  }) as RequestHandler;
};
