import { createServer } from "http";
import { createApp } from "./app";
import { ENV } from "./config/env";
import { prisma } from "./lib/prisma";

const app = createApp();
const server = createServer(app);

const PORT = ENV.port;

server.listen(PORT, () => {
  console.log(`🚀 API ready on port ${PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing server...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed. Goodbye!");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
