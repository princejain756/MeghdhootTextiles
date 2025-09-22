import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../utils/validate";
import { register, login, logout, me, listUsers } from "../controllers/auth.controller";
import { Role } from "@prisma/client";

const router = Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(32),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Password must include upper, lower, number, and symbol"),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    companyName: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3),
    password: z.string().min(8),
  }),
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.get("/users", authenticate, requireRole(Role.ADMIN), listUsers);

export default router;
