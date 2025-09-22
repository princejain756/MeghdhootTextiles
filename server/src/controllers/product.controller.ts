import type { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { asyncHandler } from "../utils/async-handler";

export const listProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await ProductService.listProducts();
  res.json({ success: true, products });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.getProductById(req.params.id);
  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.createProduct(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.updateProduct(req.params.id, req.body);
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id);
  res.status(204).send();
});
