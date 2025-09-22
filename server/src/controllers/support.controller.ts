import { Role, SupportStatus } from "@prisma/client";
import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { SupportService } from "../services/support.service";
import { asyncHandler } from "../utils/async-handler";

export const listTickets = asyncHandler(async (req: Request, res: Response) => {
  const includeAll = req.auth?.role === Role.ADMIN;
  const tickets = await SupportService.listTickets(req.auth?.userId, includeAll);
  res.json({ success: true, tickets });
});

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw createHttpError(401, "Authentication required");
  }

  const { subject, message, orderId } = req.body as {
    subject: string;
    message: string;
    orderId?: string;
  };

  const ticket = await SupportService.createTicket({
    userId: req.auth.userId,
    subject,
    message,
    orderId,
  });

  res.status(201).json({ success: true, ticket });
});

export const getTicket = asyncHandler(async (req: Request, res: Response) => {
  const includeAll = req.auth?.role === Role.ADMIN;
  const ticket = await SupportService.getTicket(req.params.id, req.auth?.userId, includeAll);
  res.json({ success: true, ticket });
});

export const addResponse = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw createHttpError(401, "Authentication required");
  }

  const { message, status } = req.body as {
    message: string;
    status?: SupportStatus;
  };

  if (!message) {
    throw createHttpError(400, "Message is required");
  }

  const response = await SupportService.addResponse({
    ticketId: req.params.id,
    authorId: req.auth.userId,
    authorRole: req.auth.role,
    message,
    status,
  });

  res.status(201).json({ success: true, response });
});

export const updateTicketStatus = asyncHandler(async (req: Request, res: Response) => {
  if (req.auth?.role !== Role.ADMIN) {
    throw createHttpError(403, "Only admins can update ticket status");
  }

  const { status } = req.body as { status: SupportStatus };

  if (!status) {
    throw createHttpError(400, "Status is required");
  }

  const ticket = await SupportService.updateStatus(req.params.id, status);
  res.json({ success: true, ticket });
});
