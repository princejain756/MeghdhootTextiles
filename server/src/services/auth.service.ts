import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { Prisma, Role, Permission } from "@prisma/client";

interface RegisterInput {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  phone?: string;
  companyName?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  tradeProfile?: {
    gstNumber?: string;
    businessType?: string;
    annualTurnover?: string;
    productInterest?: string;
    experience?: string;
    website?: string;
    additionalInfo?: string;
    termsAccepted?: boolean;
  };
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

    const created = await prisma.user.create({
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

    // Optionally create address
    if (input.address) {
      await prisma.address.create({
        data: {
          userId: created.id,
          line1: input.address.line1,
          line2: input.address.line2,
          city: input.address.city,
          state: input.address.state,
          postalCode: input.address.postalCode,
          country: input.address.country,
        },
      });
    }

    // Optionally create trade profile
    if (input.tradeProfile) {
      await prisma.tradeProfile.create({
        data: {
          userId: created.id,
          gstNumber: input.tradeProfile.gstNumber,
          businessType: input.tradeProfile.businessType,
          annualTurnover: input.tradeProfile.annualTurnover,
          productInterest: input.tradeProfile.productInterest,
          experience: input.tradeProfile.experience,
          website: input.tradeProfile.website,
          additionalInfo: input.tradeProfile.additionalInfo,
          termsAcceptedAt: input.tradeProfile.termsAccepted ? new Date() : undefined,
        },
      });
    }

    // Link historical guest orders by phone/email into real orders for this user
    try {
      const guestOrders = await prisma.guestOrder.findMany({
        where: {
          OR: [
            ...(input.phone ? [{ phone: input.phone }] : []),
            ...(input.email ? [{ email: input.email }] : []),
          ],
        },
      });

      for (const go of guestOrders) {
        try {
          await prisma.order.create({
            data: {
              userId: created.id,
              status: go.status,
              total: go.subtotal,
              items: {
                create: (go.items as any[]).map((it) => ({
                  productId: it.id,
                  quantity: it.quantity,
                  price: new Prisma.Decimal(it.price),
                })),
              },
            },
          });
        } catch (err) {
          console.warn("Failed to convert guest order", go.id, err);
        }
      }
    } catch (err) {
      // ignore failures; registration should not fail due to linking
      console.warn("Guest order linking during registration failed", err);
    }

    return created;
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

    const passwordMatches = user.passwordHash ? await verifyPassword(input.password, user.passwordHash) : false;

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
        permissions: true,
        fullName: true,
        phone: true,
        companyName: true,
        address: true,
        tradeProfile: true,
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
        permissions: true,
        fullName: true,
        phone: true,
        companyName: true,
        address: {
          select: {
            line1: true,
            line2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
        tradeProfile: {
          select: {
            gstNumber: true,
            businessType: true,
            annualTurnover: true,
            productInterest: true,
            experience: true,
            website: true,
            additionalInfo: true,
            verified: true,
            termsAcceptedAt: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return users;
  },

  async adminCreateUser(input: {
    email: string;
    username: string;
    password: string;
    fullName?: string;
    phone?: string;
    companyName?: string;
    role?: Role;
    permissions?: string[];
  }) {
    const existing = await prisma.user.findFirst({ where: { OR: [{ email: input.email }, { username: input.username }] } });
    if (existing) {
      throw createHttpError(409, "Account already exists with provided email or username");
    }
    const passwordHash = await hashPassword(input.password);
    const perms = (input.permissions ?? [])
      .map((p) => p.toUpperCase())
      .filter((p): p is Permission => Object.keys(Permission).includes(p as any));
    const user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        passwordHash,
        role: input.role ?? Role.USER,
        permissions: perms,
        fullName: input.fullName,
        phone: input.phone,
        companyName: input.companyName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        permissions: true,
        fullName: true,
        phone: true,
        companyName: true,
        createdAt: true,
      },
    });
    return user;
  },

  async adminUpdateUser(userId: string, input: { role?: Role; permissions?: string[] }) {
    const perms = (input.permissions ?? [])
      .map((p) => p.toUpperCase())
      .filter((p): p is Permission => Object.keys(Permission).includes(p as any));
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: input.role,
        permissions: input.permissions ? perms : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        permissions: true,
        fullName: true,
        phone: true,
        companyName: true,
        createdAt: true,
      },
    });
    return user;
  },

  async adminResetPassword(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw createHttpError(404, "User not found");
    const crypto = await import("crypto");
    const tmp = crypto.randomBytes(12).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 12) + "Aa@9";
    const hash = await hashPassword(tmp);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
    return { tempPassword: tmp };
  },

  async adminSetTradeVerification(userId: string, verified: boolean) {
    // Ensure trade profile exists
    const existing = await prisma.tradeProfile.findUnique({ where: { userId } });
    const updated = await prisma.tradeProfile.upsert({
      where: { userId },
      create: { userId, verified, termsAcceptedAt: undefined },
      update: { verified },
    });
    return updated;
  },

  async adminDeleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw createHttpError(404, "User not found");
    // Basic guardrails: do not allow deleting admins via API
    if (user.role === Role.ADMIN) throw createHttpError(403, "Cannot delete admin accounts");

    const [orders, tickets] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.supportTicket.count({ where: { userId } }),
    ]);
    if (orders > 0 || tickets > 0) {
      throw createHttpError(409, "Cannot delete user with existing orders or support tickets");
    }
    // Delete dependent records that have unique constraints
    await prisma.address.deleteMany({ where: { userId } });
    await prisma.tradeProfile.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const ok = user.passwordHash ? await verifyPassword(currentPassword, user.passwordHash) : false;
    if (!ok) {
      throw createHttpError(401, "Current password is incorrect");
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
  },
};
