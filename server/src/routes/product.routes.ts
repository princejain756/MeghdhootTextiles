import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../utils/validate";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { Role } from "@prisma/client";

const router = Router();

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  position: z.number().int().nonnegative().optional(),
});

const videoSchema = z.object({
  url: z.string().url(),
  position: z.number().int().nonnegative().optional(),
});

const baseProductSchema = z.object({
  name: z.string().min(1),
  summary: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive(),
  currency: z.string().length(3).optional(),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  featured: z.boolean().optional(),
  categories: z.array(z.string().min(1)).optional(),
  images: z.array(imageSchema).max(8).optional(),
  videos: z.array(videoSchema).max(8).optional(),
});

const createSchema = z.object({
  body: baseProductSchema,
});

const updateSchema = z.object({
  body: baseProductSchema.partial(),
});

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", authenticate, requireRole(Role.ADMIN), validate(createSchema), createProduct);
router.put("/:id", authenticate, requireRole(Role.ADMIN), validate(updateSchema), updateProduct);
router.delete("/:id", authenticate, requireRole(Role.ADMIN), deleteProduct);

export default router;
