import { Role } from "@prisma/client";
import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { AuthService } from "../services/auth.service";
import { issueSession, clearSession } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, fullName, phone, companyName } = req.body as {
    email: string;
    username: string;
    password: string;
    fullName?: string;
    phone?: string;
    companyName?: string;
  };

  const user = await AuthService.registerUser({
    email,
    username,
    password,
    fullName,
    phone,
    companyName,
  });

  issueSession(res, { sub: user.id, role: user.role });

  res.status(201).json({
    success: true,
    user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body as { identifier: string; password: string };

  const user = await AuthService.login({ identifier, password });

  issueSession(res, { sub: user.id, role: user.role });

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      companyName: user.companyName,
      createdAt: user.createdAt,
    },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearSession(res);
  res.json({ success: true });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw createHttpError(401, "Authentication required");
  }

  const user = await AuthService.getSessionUser(req.auth.userId);

  res.json({
    success: true,
    user,
  });
});

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await AuthService.listUsers();
  res.json({ success: true, users });
});
