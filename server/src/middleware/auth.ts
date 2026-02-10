import { Permission, Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import { ENV } from "../config/env";
import { prisma } from "../lib/prisma";

export const TOKEN_COOKIE_NAME = "meghdoot_session";

interface TokenPayload {
  sub: string;
  role: Role;
}

const isProduction = ENV.nodeEnv === "production";

const getTokenFromRequest = (req: Request) => {
  const cookieToken = req.cookies?.[TOKEN_COOKIE_NAME];
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;

  return cookieToken || headerToken;
};

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(createHttpError(401, "Authentication required"));
  }

  try {
    const payload = jwt.verify(token, ENV.jwtSecret) as TokenPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { permissions: true } });
    req.auth = { userId: payload.sub, role: payload.role, permissions: user?.permissions ?? [] };
    return next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired session"));
  }
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, ENV.jwtSecret) as TokenPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { permissions: true } });
    req.auth = { userId: payload.sub, role: payload.role, permissions: user?.permissions ?? [] };
  } catch (error) {
    // Ignore invalid token for optional auth flows
  }

  next();
};

export const requireRole = (roles: Role | Role[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(createHttpError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return next(createHttpError(403, "You do not have permission to perform this action"));
    }

    return next();
  };
};

export const requirePermission = (perms: Permission | Permission[]) => {
  const allowed = Array.isArray(perms) ? perms : [perms];
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(createHttpError(401, "Authentication required"));
    }
    if (req.auth.role === Role.ADMIN) return next();
    const has = req.auth.permissions?.some((p) => allowed.includes(p));
    if (!has) return next(createHttpError(403, "Insufficient permissions"));
    return next();
  };
};

export const requireRoleOrPermission = (roles: Role | Role[], perms: Permission | Permission[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const allowedPerms = Array.isArray(perms) ? perms : [perms];
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(createHttpError(401, "Authentication required"));
    if (allowedRoles.includes(req.auth.role)) return next();
    const has = req.auth.permissions?.some((p) => allowedPerms.includes(p));
    if (!has) return next(createHttpError(403, "Insufficient permissions"));
    return next();
  };
};

export const issueSession = (res: Response, payload: TokenPayload) => {
  const token = jwt.sign(payload, ENV.jwtSecret, { expiresIn: "7d" });

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const clearSession = (res: Response) => {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
  });
};
