import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRoleOrPermission } from "../middleware/auth";
import { Permission, Role } from "@prisma/client";
import { validate } from "../utils/validate";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";

const router = Router();

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().nullable().optional(),
  position: z.number().int().nonnegative().nullable().optional(),
});

const videoSchema = z.object({
  url: z.string().url(),
  position: z.number().int().nonnegative().nullable().optional(),
});

const specItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const baseProductSchema = z.object({
  name: z.string().min(1),
  summary: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shippingInfo: z.string().nullable().optional(),
  careInstructions: z.string().nullable().optional(),
  price: z.number().positive(),
  currency: z.string().length(3).nullable().optional(),
  sku: z.string().nullable().optional(),
  stock: z.number().int().nonnegative().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  categories: z.array(z.string().min(1)).nullable().optional(),
  images: z.array(imageSchema).max(8).nullable().optional(),
  videos: z.array(videoSchema).max(8).nullable().optional(),
  specs: z.array(specItemSchema).max(50).nullable().optional(),
});

const createSchema = z.object({
  body: baseProductSchema,
});

const updateSchema = z.object({
  body: baseProductSchema.partial(),
});

router.get("/", listProducts);
router.get("/:id", getProduct);
// Allow ADMIN and UPLOADER to create/update products; delete remains ADMIN-only
router.post(
  "/",
  authenticate,
  requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.PRODUCTS),
  validate(createSchema),
  createProduct
);
router.put(
  "/:id",
  authenticate,
  requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.PRODUCTS),
  validate(updateSchema),
  updateProduct
);
router.delete(
  "/:id",
  authenticate,
  requireRoleOrPermission(Role.ADMIN, Permission.PRODUCTS),
  deleteProduct
);

export default router;
