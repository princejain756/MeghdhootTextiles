import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../utils/validate";
import { addResponse, createTicket, getTicket, listTickets, updateTicketStatus } from "../controllers/support.controller";
import { Role, SupportStatus } from "@prisma/client";

const router = Router();

router.get("/", authenticate, listTickets);

router.post(
  "/",
  authenticate,
  validate(
    z.object({
      body: z.object({
        subject: z.string().min(3),
        message: z.string().min(3),
        orderId: z.string().uuid().optional(),
      }),
    })
  ),
  createTicket
);

router.get(
  "/:id",
  authenticate,
  validate(z.object({ params: z.object({ id: z.string().uuid() }) })),
  getTicket
);

router.post(
  "/:id/respond",
  authenticate,
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        message: z.string().min(1),
        status: z.nativeEnum(SupportStatus).optional(),
      }),
    })
  ),
  addResponse
);

router.patch(
  "/:id/status",
  authenticate,
  requireRole(Role.ADMIN),
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: z.object({ status: z.nativeEnum(SupportStatus) }),
    })
  ),
  updateTicketStatus
);

export default router;
