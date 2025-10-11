import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { CatalogService } from "../services/catalog.service";

export const listCatalogs = asyncHandler(async (_req: Request, res: Response) => {
  const catalogs = await CatalogService.list();
  res.json({ success: true, catalogs });
});

export const getCatalog = asyncHandler(async (req: Request, res: Response) => {
  const catalog = await CatalogService.get(req.params.id);
  res.json({ success: true, catalog });
});

export const createCatalog = asyncHandler(async (req: Request, res: Response) => {
  const catalog = await CatalogService.create(req.body);
  res.status(201).json({ success: true, catalog });
});

export const updateCatalog = asyncHandler(async (req: Request, res: Response) => {
  const catalog = await CatalogService.update(req.params.id, req.body);
  res.json({ success: true, catalog });
});

export const setCatalogProducts = asyncHandler(async (req: Request, res: Response) => {
  const catalog = await CatalogService.setProducts(req.params.id, req.body.productIds ?? []);
  res.json({ success: true, catalog });
});

export const deleteCatalog = asyncHandler(async (req: Request, res: Response) => {
  try {
    await CatalogService.remove(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    // Map known Prisma errors to clearer API responses
    if (err?.code === 'P2025') {
      // Record to delete does not exist.
      res.status(404).json({ success: false, message: 'Catalog not found' });
      return;
    }
    throw err;
  }
});
