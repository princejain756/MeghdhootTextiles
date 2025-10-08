import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../utils/validate";
import { createOrder, listOrders, getOrder, updateOrderStatus, upsertDelivery, createGuestOrder } from "../controllers/order.controller";
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

const guestOrderSchema = z.object({
  customerDetails: z.object({
    customerName: z.string().min(2),
    phone: z.string().min(10),
    businessName: z.string().min(2),
    gst: z.string().optional(),
    email: z.string().email().optional(),
    isGuestOrder: z.boolean(),
  }),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    moq: z.number().optional(),
    note: z.string().optional(),
  })).min(1),
  subtotal: z.number(),
  totalItems: z.number(),
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

router.post(
  "/guest",
  validate(
    z.object({
      body: guestOrderSchema,
    })
  ),
  createGuestOrder
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
