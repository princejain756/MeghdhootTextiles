import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";

import { ENV } from "./config/env";
import { notFoundHandler } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import catalogRoutes from "./routes/catalog.routes";
import orderRoutes from "./routes/order.routes";
import supportRoutes from "./routes/support.routes";
import uploadRoutes from "./routes/upload.routes";
import assetRoutes from "./routes/asset.routes";
import whatsappRoutes from "./routes/whatsapp.routes";
import { optionalAuth } from "./middleware/auth";

export const createApp = () => {
  const app = express();
  // Behind reverse proxies (e.g., Nginx, Render), trust X-Forwarded-* headers
  app.set("trust proxy", true);

  // Configure security headers. Allow cross-origin resource loading for images/static.
  app.use(
    helmet({
      // Images in the admin run on a different origin (e.g., Vite 5173)
      // so we must allow cross-origin resource embedding for the uploads path.
      crossOriginResourcePolicy: { policy: "cross-origin" },
      // COEP can interfere with dev cross-origin assets; keep disabled.
      crossOriginEmbedderPolicy: false,
      // Disable X-Frame-Options to allow PDFs to be displayed in iframes on same origin
      frameguard: false,
      // Allow iframes to embed PDFs and other content from same origin
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          imgSrc: ["'self'", "data:", "https:", "http:"],
          fontSrc: ["'self'", "data:"],
          connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
          frameSrc: ["'self'", "blob:"],
          objectSrc: ["'self'", "blob:"],
          mediaSrc: ["'self'", "blob:"],
          workerSrc: ["'self'", "blob:"],
        },
      },
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        // Always allow non-browser or same-origin requests
        if (!origin) return callback(null, true);

        const configured = (ENV.clientOrigin || "")
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean);

        // In development, allow any localhost/127.0.0.1 origin
        if (ENV.nodeEnv !== "production") {
          try {
            const url = new URL(origin);
            if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
              return callback(null, true);
            }
          } catch {
            // fallthrough
          }
        }

        if (configured.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS: Origin not allowed: ${origin}`));
      },
    })
  );

  app.use(morgan(ENV.nodeEnv === "production" ? "combined" : "dev"));

  // Ensure uploads directory exists and serve it statically
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch {
    // ignore
  }

  // Serve static files with proper Content-Type headers for PDFs
  app.use("/uploads", (req, res, next) => {
    if (req.path.toLowerCase().endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    next();
  }, express.static(uploadsDir));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/products", optionalAuth, productRoutes);
  app.use("/api/catalogs", optionalAuth, catalogRoutes);
  app.use("/api/orders", optionalAuth, orderRoutes);
  app.use("/api/support", optionalAuth, supportRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/assets", assetRoutes);
  app.use("/whatsapp", whatsappRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
