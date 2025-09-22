import createHttpError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as ZodError;
        return next(
          createHttpError(400, zodError.issues.map((issue) => issue.message).join("; "))
        );
      }

      next(createHttpError(400, "Invalid request"));
    }
  };
};
