import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { authenticate, requireRole } from "../middleware/auth";
import { Role } from "@prisma/client";
import { respondWithUploadedFiles } from "../controllers/upload.controller";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(process.cwd(), "uploads"));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 8,
  },
});

// Separate uploader for PDFs
const pdfFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const uploadPdf = multer({
  storage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 4,
  },
});

// Admin-only endpoint for image uploads
router.post(
  "/images",
  authenticate,
  requireRole(Role.ADMIN),
  upload.array("files", 8),
  respondWithUploadedFiles
);

router.post(
  "/pdfs",
  authenticate,
  requireRole(Role.ADMIN),
  uploadPdf.array("files", 4),
  respondWithUploadedFiles
);

export default router;
