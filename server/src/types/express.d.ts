import { Role, Permission } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: Role;
        permissions: Permission[];
      };
    }
  }
}

export {};
