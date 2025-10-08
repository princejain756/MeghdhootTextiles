import { OrderStatus, Prisma } from "@prisma/client";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

type DeliveryInput = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  courier?: string;
  trackingNumber?: string;
  status?: string;
  estimatedDelivery?: Date | null;
  instructions?: string;
};

type CreateOrderInput = {
  userId: string;
  items: OrderItemInput[];
  delivery: DeliveryInput;
};

export const OrderService = {
  async createOrder({ userId, items, delivery }: CreateOrderInput) {
    if (!items.length) {
      throw createHttpError(400, "Order must contain at least one item");
    }

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
    });

    if (products.length !== items.length) {
      throw createHttpError(400, "One or more products could not be found");
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    const insufficientStock = items.find((item) => {
      const product = productMap.get(item.productId);
      return !product || product.stock < item.quantity;
    });

    if (insufficientStock) {
      const product = productMap.get(insufficientStock.productId);
      throw createHttpError(
        400,
        `${product?.name ?? "Product"} does not have enough stock to fulfill the order`
      );
    }

    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      if (!product) return sum;
      return sum + Number(product.price) * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          total: new Prisma.Decimal(total),
          items: {
            create: items.map((item) => {
              const product = productMap.get(item.productId);
              if (!product) {
                throw createHttpError(400, "Invalid product in order");
              }

              return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
          delivery: {
            create: {
              addressLine1: delivery.addressLine1,
              addressLine2: delivery.addressLine2,
              city: delivery.city,
              state: delivery.state,
              postalCode: delivery.postalCode,
              country: delivery.country,
              courier: delivery.courier,
              trackingNumber: delivery.trackingNumber,
              status: delivery.status ?? "Preparing",
              estimatedDelivery: delivery.estimatedDelivery ?? undefined,
              instructions: delivery.instructions,
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          delivery: true,
        },
      });

      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      );

      return created;
    });

    return order;
  },

  async listOrders(userId?: string, includeAll = false) {
    return prisma.order.findMany({
      where: includeAll
        ? undefined
        : {
            userId,
          },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        delivery: true,
        user: includeAll,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getOrder(orderId: string, userId?: string, includeAll = false) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        delivery: true,
        user: includeAll,
      },
    });

    if (!order) {
      throw createHttpError(404, "Order not found");
    }

    if (!includeAll && order.userId !== userId) {
      throw createHttpError(403, "You do not have access to this order");
    }

    return order;
  },

  async updateStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        delivery: true,
        user: true,
      },
    });
  },

  async upsertDelivery(orderId: string, delivery: DeliveryInput) {
    await this.getOrder(orderId, undefined, true);

    const updated = await prisma.deliveryInfo.upsert({
      where: { orderId },
      create: {
        orderId,
        addressLine1: delivery.addressLine1,
        addressLine2: delivery.addressLine2,
        city: delivery.city,
        state: delivery.state,
        postalCode: delivery.postalCode,
        country: delivery.country,
        courier: delivery.courier,
        trackingNumber: delivery.trackingNumber,
        status: delivery.status ?? "Preparing",
        estimatedDelivery: delivery.estimatedDelivery ?? undefined,
        instructions: delivery.instructions,
      },
      update: {
        addressLine1: delivery.addressLine1,
        addressLine2: delivery.addressLine2,
        city: delivery.city,
        state: delivery.state,
        postalCode: delivery.postalCode,
        country: delivery.country,
        courier: delivery.courier,
        trackingNumber: delivery.trackingNumber,
        status: delivery.status ?? "Preparing",
        estimatedDelivery: delivery.estimatedDelivery ?? undefined,
        instructions: delivery.instructions,
      },
    });

    return updated;
  },

  async createGuestOrder(orderData: {
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
  }) {
    // Store guest order using the new schema with proper types
    const guestOrder = await prisma.guestOrder.create({
      data: {
        customerName: orderData.customerDetails.customerName,
        phone: orderData.customerDetails.phone,
        businessName: orderData.customerDetails.businessName,
        gst: orderData.customerDetails.gst,
        email: orderData.customerDetails.email,
        status: OrderStatus.PENDING,
        items: orderData.items, // JSON field will handle this automatically
        subtotal: new Prisma.Decimal(orderData.subtotal),
        totalItems: orderData.totalItems,
      },
    });

    return guestOrder;
  },
};
