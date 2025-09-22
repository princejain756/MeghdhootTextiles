import { Role, SupportStatus } from "@prisma/client";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";

type CreateTicketInput = {
  userId?: string;
  orderId?: string;
  subject: string;
  message: string;
};

type AddResponseInput = {
  ticketId: string;
  authorId?: string;
  authorRole: Role;
  message: string;
  status?: SupportStatus;
};

export const SupportService = {
  async listTickets(userId?: string, includeAll = false) {
    return prisma.supportTicket.findMany({
      where: includeAll ? undefined : { userId },
      include: {
        responses: {
          orderBy: { createdAt: "asc" },
          include: {
            author: includeAll,
          },
        },
        order: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async createTicket(input: CreateTicketInput) {
    if (input.orderId) {
      const order = await prisma.order.findUnique({ where: { id: input.orderId } });
      if (!order) {
        throw createHttpError(400, "Order not found");
      }
    }

    return prisma.supportTicket.create({
      data: {
        userId: input.userId,
        orderId: input.orderId,
        subject: input.subject,
        message: input.message,
      },
    });
  },

  async getTicket(ticketId: string, userId?: string, includeAll = false) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        responses: {
          orderBy: { createdAt: "asc" },
          include: {
            author: includeAll,
          },
        },
        order: true,
      },
    });

    if (!ticket) {
      throw createHttpError(404, "Support ticket not found");
    }

    if (!includeAll && ticket.userId !== userId) {
      throw createHttpError(403, "You do not have access to this ticket");
    }

    return ticket;
  },

  async addResponse({ ticketId, authorId, authorRole, message, status }: AddResponseInput) {
    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });

    if (!ticket) {
      throw createHttpError(404, "Support ticket not found");
    }

    const response = await prisma.supportResponse.create({
      data: {
        ticketId,
        authorId,
        authorRole,
        message,
      },
      include: {
        author: authorRole === Role.ADMIN,
      },
    });

    if (status) {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status },
      });
    }

    return response;
  },

  async updateStatus(ticketId: string, status: SupportStatus) {
    return prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });
  },
};
