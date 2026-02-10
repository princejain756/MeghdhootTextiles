import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRoleOrPermission } from "../middleware/auth";
import { Permission, Role, SupportStatus } from "@prisma/client";
import { validate } from "../utils/validate";
import { addResponse, createTicket, getTicket, listTickets, updateTicketStatus } from "../controllers/support.controller";

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
  requireRoleOrPermission(Role.ADMIN, Permission.SUPPORT),
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: z.object({ status: z.nativeEnum(SupportStatus) }),
    })
  ),
  updateTicketStatus
);

export default router;
