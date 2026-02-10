import { Role } from "@prisma/client";
import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { AuthService } from "../services/auth.service";
import { issueSession, clearSession } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const {
    email,
    username,
    password,
    fullName,
    phone,
    companyName,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    gstNumber,
    businessType,
    annualTurnover,
    productInterest,
    experience,
    website,
    additionalInfo,
    termsAccepted,
  } = req.body as Record<string, unknown> as {
    email: string;
    username: string;
    password: string;
    fullName?: string;
    phone?: string;
    companyName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    gstNumber?: string;
    businessType?: string;
    annualTurnover?: string;
    productInterest?: string;
    experience?: string;
    website?: string;
    additionalInfo?: string;
    termsAccepted?: boolean;
  };

  const user = await AuthService.registerUser({
    email,
    username,
    password,
    fullName,
    phone,
    companyName,
    address:
      addressLine1 && city && state && postalCode
        ? {
            line1: addressLine1,
            line2: addressLine2,
            city,
            state,
            postalCode,
            country: country || "IN",
          }
        : undefined,
    tradeProfile:
      gstNumber || businessType || annualTurnover || productInterest || experience || website || additionalInfo || termsAccepted
        ? {
            gstNumber,
            businessType,
            annualTurnover,
            productInterest,
            experience,
            website,
            additionalInfo,
            termsAccepted: Boolean(termsAccepted),
          }
        : undefined,
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

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw createHttpError(401, "Authentication required");
  }

  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
  await AuthService.changePassword(req.auth.userId, currentPassword, newPassword);
  res.json({ success: true });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, fullName, phone, companyName, role, permissions } = req.body as {
    email: string;
    username: string;
    password: string;
    fullName?: string;
    phone?: string;
    companyName?: string;
    role?: Role;
    permissions?: string[];
  };

  const user = await AuthService.adminCreateUser({
    email,
    username,
    password,
    fullName,
    phone,
    companyName,
    role,
    permissions,
  });
  res.status(201).json({ success: true, user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { role, permissions } = req.body as { role?: Role; permissions?: string[] };
  const user = await AuthService.adminUpdateUser(req.params.id, { role, permissions });
  res.json({ success: true, user });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { tempPassword } = await AuthService.adminResetPassword(req.params.id);
  res.json({ success: true, tempPassword });
});

export const setTradeVerification = asyncHandler(async (req: Request, res: Response) => {
  const { verified } = req.body as { verified: boolean };
  const profile = await AuthService.adminSetTradeVerification(req.params.id, verified);
  res.json({ success: true, tradeProfile: profile });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.adminDeleteUser(req.params.id);
  res.json({ success: true });
});

