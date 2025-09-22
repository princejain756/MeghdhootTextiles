import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../middleware/auth";
import { Role } from "@prisma/client";
import { validate } from "../utils/validate";
import {
  createCatalog,
  deleteCatalog,
  getCatalog,
  listCatalogs,
  setCatalogProducts,
  updateCatalog,
} from "../controllers/catalog.controller";

const router = Router();

const baseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  productIds: z.array(z.string().uuid()).optional(),
});

const createSchema = z.object({ body: baseSchema });
const updateSchema = z.object({ body: baseSchema.partial() });

const setProductsSchema = z.object({
  body: z.object({ productIds: z.array(z.string().uuid()) }),
});

router.get("/", listCatalogs);
router.get("/:id", getCatalog);
router.post("/", authenticate, requireRole(Role.ADMIN), validate(createSchema), createCatalog);
router.put("/:id", authenticate, requireRole(Role.ADMIN), validate(updateSchema), updateCatalog);
router.put(
  "/:id/products",
  authenticate,
  requireRole(Role.ADMIN),
  validate(setProductsSchema),
  setCatalogProducts
);
router.delete("/:id", authenticate, requireRole(Role.ADMIN), deleteCatalog);

export default router;

