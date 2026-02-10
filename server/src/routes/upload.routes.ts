import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { authenticate, requireRoleOrPermission } from "../middleware/auth";
import { Role, Permission } from "@prisma/client";
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
    fileSize: 10 * 1024 * 1024, // 10MB per file
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

// Video file filter
const videoFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"));
  }
};

const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file
    files: 4,
  },
});

// Admin-only endpoint for image uploads
router.post(
  "/images",
  authenticate,
  requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.UPLOADS),
  upload.array("files", 8),
  respondWithUploadedFiles
);

router.post(
  "/pdfs",
  authenticate,
  requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.UPLOADS),
  uploadPdf.array("files", 4),
  respondWithUploadedFiles
);

router.post(
  "/videos",
  authenticate,
  requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.UPLOADS),
  uploadVideo.array("files", 4),
  respondWithUploadedFiles
);

export default router;

