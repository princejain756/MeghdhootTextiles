import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole, requireRoleOrPermission } from "../middleware/auth";
import { validate } from "../utils/validate";
import { register, login, logout, me, listUsers, changePassword, createUser, updateUser, resetPassword, setTradeVerification, deleteUser } from "../controllers/auth.controller";
import { Role, Permission } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { issueSession } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      username: z.string().min(3).max(32),
      password: z
        .string()
        .min(8)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
          "Password must include upper, lower, number, and symbol"
        ),
      fullName: z.string().optional(),
      phone: z.string().optional(),
      companyName: z.string().optional(),

      // Optional address fields (created if provided)
      addressLine1: z.string().min(3).optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),

      // Optional trade profile fields (created if provided)
      gstNumber: z.string().optional(),
      businessType: z.string().optional(),
      annualTurnover: z.string().optional(),
      productInterest: z.string().optional(),
      experience: z.string().optional(),
      website: z.string().url().optional(),
      additionalInfo: z.string().optional(),
      termsAccepted: z.boolean().optional(),
    })
    .refine(
      (b) => {
        // If any address field is provided, require minimum essentials
        const anyAddress = !!(
          b.addressLine1 || b.city || b.state || b.postalCode || b.country
        );
        if (!anyAddress) return true;
        return Boolean(b.addressLine1 && b.city && b.state && b.postalCode && (b.country ?? "").length >= 2);
      },
      { message: "Incomplete address provided" }
    ),
});

const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3),
    password: z.string().min(8),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(8),
    newPassword: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must include upper, lower, number, and symbol"
      ),
  }),
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.get("/users", authenticate, requireRoleOrPermission(Role.ADMIN, Permission.CUSTOMERS), listUsers);
router.post("/users", authenticate, requireRoleOrPermission(Role.ADMIN, Permission.CUSTOMERS), createUser);
router.patch(
  "/users/:id",
  authenticate,
  requireRoleOrPermission(Role.ADMIN, Permission.CUSTOMERS),
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        role: z.nativeEnum(Role).optional(),
        permissions: z.array(z.string()).optional(),
      }),
    }) as any
  ),
  updateUser
);
router.post(
  "/users/:id/reset-password",
  authenticate,
  requireRoleOrPermission(Role.ADMIN, Permission.CUSTOMERS),
  validate(z.object({ params: z.object({ id: z.string().uuid() }) })),
  resetPassword
);
router.patch(
  "/users/:id/trade-verify",
  authenticate,
  requireRoleOrPermission(Role.ADMIN, Permission.CUSTOMERS),
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: z.object({ verified: z.boolean() }),
    })
  ),
  setTradeVerification
);
router.delete(
  "/users/:id",
  authenticate,
  requireRoleOrPermission(Role.ADMIN, Permission.CUSTOMERS),
  validate(z.object({ params: z.object({ id: z.string().uuid() }) })),
  deleteUser
);
router.post("/change-password", authenticate, validate(changePasswordSchema), changePassword);

export default router;

// Google OAuth routes

// Google OAuth routes
router.get("/google", (req, res) => {
  const redirectUri = "https://meghdoottextiles.com/api/auth/google/callback";
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email%20profilescope=email profile&response_type=coderesponse_type=codescope=email profile&response_type=codeaccess_type=online`;
  res.redirect(googleUrl);
});

router.get("/google/callback", async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.redirect("/login?error=no_code");
    }

    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: "https://meghdoottextiles.com/api/auth/google/callback"
    });

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams
    });

    const tokenData: any = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return res.redirect("/login?error=token_failed");
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userData: any = await userResponse.json();

    if (!userData.email) {
      return res.redirect("/login?error=no_email");
    }

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: userData.id },
          { email: userData.email }
        ]
      }
    });

    if (user && !user.googleId) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: userData.id }
      });
    } else if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          googleId: userData.id,
          email: userData.email,
          username: userData.email.split("@")[0] + "_" + Math.random().toString(36).substr(2, 4),
          fullName: userData.name,
          role: "USER"
        }
      });
    }

    // Issue session
    const token = issueSession(res, { sub: user.id, role: user.role });
    
    // Redirect to dashboard
    res.redirect("/dashboard");
    
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect("/login?error=oauth_failed");
  }
});
