import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../utils/validate";
import { createOrder, listOrders, getOrder, updateOrderStatus, upsertDelivery } from "../controllers/order.controller";
import { OrderStatus, Role } from "@prisma/client";

const router = Router();

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const deliverySchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  courier: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  instructions: z.string().optional(),
});

router.post(
  "/",
  authenticate,
  validate(
    z.object({
      body: z.object({
        items: z.array(orderItemSchema).min(1),
        delivery: deliverySchema,
      }),
    })
  ),
  createOrder
);

router.get("/", authenticate, listOrders);
router.get(
  "/:id",
  authenticate,
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
    })
  ),
  getOrder
);

router.patch(
  "/:id/status",
  authenticate,
  requireRole(Role.ADMIN),
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: z.object({ status: z.nativeEnum(OrderStatus) }),
    })
  ),
  updateOrderStatus
);

router.put(
  "/:id/delivery",
  authenticate,
  requireRole(Role.ADMIN),
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: z.object({ delivery: deliverySchema }),
    })
  ),
  upsertDelivery
);

export default router;
