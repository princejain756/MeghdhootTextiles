import { OrderStatus } from "@prisma/client";
import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { OrderService } from "../services/order.service";
import { asyncHandler } from "../utils/async-handler";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw createHttpError(401, "Authentication required");
  }

  const { items, delivery } = req.body as {
    items: Array<{ productId: string; quantity: number }>;
    delivery: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      courier?: string;
      trackingNumber?: string;
      status?: string;
      estimatedDelivery?: string | null;
      instructions?: string;
    };
  };

  const order = await OrderService.createOrder({
    userId: req.auth.userId,
    items,
    delivery: {
      ...delivery,
      estimatedDelivery: delivery.estimatedDelivery
        ? new Date(delivery.estimatedDelivery)
        : null,
    },
  });

  res.status(201).json({ success: true, order });
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const includeAll = req.auth?.role === "ADMIN";
  const orders = await OrderService.listOrders(req.auth?.userId, includeAll);
  res.json({ success: true, orders });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const includeAll = req.auth?.role === "ADMIN";
  const order = await OrderService.getOrder(req.params.id, req.auth?.userId, includeAll);
  res.json({ success: true, order });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status: OrderStatus };
  const order = await OrderService.updateStatus(req.params.id, status);
  res.json({ success: true, order });
});

export const upsertDelivery = asyncHandler(async (req: Request, res: Response) => {
  const { delivery } = req.body as {
    delivery: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      courier?: string;
      trackingNumber?: string;
      status?: string;
      estimatedDelivery?: string | null;
      instructions?: string;
    };
  };

  const updated = await OrderService.upsertDelivery(req.params.id, {
    ...delivery,
    estimatedDelivery: delivery.estimatedDelivery
      ? new Date(delivery.estimatedDelivery)
      : null,
  });

  res.json({ success: true, delivery: updated });
});

export const createGuestOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderData = req.body as {
    customerDetails: {
      customerName: string;
      phone: string;
      businessName: string;
      gst?: string;
      email?: string;
      isGuestOrder: boolean;
    };
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      moq?: number;
      note?: string;
    }>;
    subtotal: number;
    totalItems: number;
  };

  const guestOrder = await OrderService.createGuestOrder(orderData);

  res.status(201).json({ success: true, order: guestOrder });
});
