import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { Role } from "@prisma/client";

interface RegisterInput {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  phone?: string;
  companyName?: string;
}

interface LoginInput {
  identifier: string;
  password: string;
}

export const AuthService = {
  async registerUser(input: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
      select: { id: true },
    });

    if (existing) {
      throw createHttpError(409, "Account already exists with provided email or username");
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        passwordHash,
        role: Role.USER,
        fullName: input.fullName,
        phone: input.phone,
        companyName: input.companyName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        fullName: true,
        phone: true,
        companyName: true,
        createdAt: true,
      },
    });

    return user;
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.identifier }, { username: input.identifier }],
      },
    });

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatches = await verifyPassword(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw createHttpError(401, "Invalid credentials");
    }

    return user;
  },

  async getSessionUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        fullName: true,
        phone: true,
        companyName: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    return user;
  },

  async listUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        fullName: true,
        phone: true,
        companyName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return users;
  },
};
