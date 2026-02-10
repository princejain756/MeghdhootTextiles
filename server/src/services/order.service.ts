import { OrderStatus, Prisma, Role } from "@prisma/client";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";
import crypto from "crypto";

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
  async createOrderFromWhatsApp(userId: string, items: OrderItemInput[]) {
    if (!items.length) {
      throw createHttpError(400, "Order must contain at least one item");
    }

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    if (products.length !== items.length) {
      throw createHttpError(400, "One or more products could not be found");
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product ? Number(product.price) * item.quantity : 0);
    }, 0);

    // Create order without reserving stock and without delivery yet.
    return prisma.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        total: new Prisma.Decimal(total),
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: product.id,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: {
        items: { include: { product: true } },
        delivery: true,
      },
    });
  },
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

    // Attempt to link to an existing user by email or phone
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(orderData.customerDetails.email ? [{ email: orderData.customerDetails.email }] : []),
          { phone: orderData.customerDetails.phone },
        ],
      },
    });

    let tempPassword: string | undefined;
    if (!user) {
      // Create a tracking account with a generated username/password
      const baseUsername = (orderData.customerDetails.businessName || orderData.customerDetails.customerName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$|--+/g, "")
        .slice(0, 20) || "guest";
      const suffix = Math.random().toString(36).slice(2, 6);
      const username = `${baseUsername}-${suffix}`;
      const email = orderData.customerDetails.email || `guest-${Date.now()}-${suffix}@meghdoot.local`; // synthetic email
      tempPassword = crypto
        .randomBytes(12)
        .toString("base64")
        .replace(/[^A-Za-z0-9]/g, "")
        .slice(0, 12) + "A@9"; // ensure complexity
      const passwordHash = await hashPassword(tempPassword);
      user = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
          role: Role.USER,
          fullName: orderData.customerDetails.customerName,
          phone: orderData.customerDetails.phone,
          companyName: orderData.customerDetails.businessName,
        },
      });
    }

    // Create a formal order for the user using product links where possible
    try {
      const itemsForOrder = orderData.items
        .map((it) => ({ productId: it.id, quantity: it.quantity }))
        .filter((i) => typeof i.productId === "string" && i.productId.length > 0 && i.quantity > 0);
      if (itemsForOrder.length) {
        await prisma.order.create({
          data: {
            userId: user.id,
            status: OrderStatus.PENDING,
            total: new Prisma.Decimal(orderData.subtotal),
            items: {
              create: orderData.items.map((it) => ({
                productId: it.id,
                quantity: it.quantity,
                price: new Prisma.Decimal(it.price),
              })),
            },
          },
        });
      }
    } catch (err) {
      // Log and continue; guest order is still created
      console.warn("Failed to mirror guest order into user order:", err);
    }

    return { guestOrder, userCreated: user, tempPassword };
  },
};
