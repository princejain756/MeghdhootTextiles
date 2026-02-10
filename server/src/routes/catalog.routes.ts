import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRoleOrPermission } from "../middleware/auth";
import { Permission, Role } from "@prisma/client";
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
  catalogCode: z.string().optional(),
  fabric: z.string().optional(),
  setSize: z.string().optional(),
  dispatch: z.string().optional(),
  // Accept absolute or relative URLs; server does not fetch, just stores
  coverImageUrl: z.string().min(1).optional(),
  pdfUrl: z.string().min(1).optional(),
  itemsCount: z.preprocess((v) => (v === '' || v == null ? undefined : Number(v)), z.number().int().min(0).optional()),
  price: z.preprocess((v) => (v === '' || v == null ? undefined : Number(v)), z.number().positive().optional()),
  productIds: z.array(z.string().uuid()).optional(),
});

const createSchema = z.object({ body: baseSchema });
const updateSchema = z.object({ body: baseSchema.partial() });

const setProductsSchema = z.object({
  body: z.object({ productIds: z.array(z.string().uuid()) }),
});

router.get("/", listCatalogs);
router.get("/:id", getCatalog);
// Allow ADMIN and UPLOADER to create/update catalogs and set products; delete remains ADMIN-only
router.post(
  "/",
  authenticate,
  requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.CATALOGS),
  validate(createSchema),
  createCatalog
);
router.put(
  "/:id",
  authenticate,
  requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.CATALOGS),
  validate(updateSchema),
  updateCatalog
);
router.put(
  "/:id/products",
  authenticate,
  requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.CATALOGS),
  validate(setProductsSchema),
  setCatalogProducts
);
router.delete(
  "/:id",
  authenticate,
  requireRoleOrPermission(Role.ADMIN, Permission.CATALOGS),
  deleteCatalog
);

export default router;
