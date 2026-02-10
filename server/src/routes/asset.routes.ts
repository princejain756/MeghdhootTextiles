import { Router } from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { authenticate, requireRoleOrPermission } from "../middleware/auth";
import { Role, Permission, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();
const execAsync = promisify(exec);
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

// Helper to get file stats
const getFileInfo = async (filename: string) => {
    const filepath = path.join(UPLOADS_DIR, filename);
    try {
        const stats = await fs.promises.stat(filepath);
        const ext = path.extname(filename).toLowerCase();
        const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"].includes(ext);
        const isVideo = [".mp4", ".webm", ".ogg", ".mov", ".avi"].includes(ext);
        const isPdf = ext === ".pdf";

        return {
            filename,
            size: stats.size,
            type: isImage ? "image" : isVideo ? "video" : isPdf ? "pdf" : "other",
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
        };
    } catch {
        return null;
    }
};

// List all assets
router.get(
    "/",
    authenticate,
    requireRoleOrPermission([Role.ADMIN, Role.UPLOADER], Permission.UPLOADS),
    async (req, res) => {
        try {
            const files = await fs.promises.readdir(UPLOADS_DIR);
            const assets = await Promise.all(
                files.map((filename) => getFileInfo(filename))
            );
            const validAssets = assets.filter(Boolean);
            res.json({ success: true, assets: validAssets });
        } catch (error) {
            console.error("Error listing assets:", error);
            res.status(500).json({ success: false, message: "Failed to list assets" });
        }
    }
);

// Delete single asset
router.delete(
    "/:filename",
    authenticate,
    requireRoleOrPermission([Role.ADMIN], Permission.UPLOADS),
    async (req, res) => {
        try {
            const { filename } = req.params;
            const filepath = path.join(UPLOADS_DIR, filename);

            // Security check - prevent path traversal
            if (!filepath.startsWith(UPLOADS_DIR)) {
                return res.status(400).json({ success: false, message: "Invalid filename" });
            }

            await fs.promises.unlink(filepath);
            res.json({ success: true, message: "Asset deleted" });
        } catch (error) {
            console.error("Error deleting asset:", error);
            res.status(500).json({ success: false, message: "Failed to delete asset" });
        }
    }
);

// Bulk delete assets
router.post(
    "/bulk-delete",
    authenticate,
    requireRoleOrPermission([Role.ADMIN], Permission.UPLOADS),
    async (req, res) => {
        try {
            const { filenames } = req.body as { filenames: string[] };
            if (!Array.isArray(filenames)) {
                return res.status(400).json({ success: false, message: "filenames must be an array" });
            }

            const results = await Promise.allSettled(
                filenames.map(async (filename) => {
                    const filepath = path.join(UPLOADS_DIR, filename);
                    if (!filepath.startsWith(UPLOADS_DIR)) {
                        throw new Error("Invalid filename");
                    }
                    await fs.promises.unlink(filepath);
                    return filename;
                })
            );

            const deleted = results.filter((r) => r.status === "fulfilled").length;
            const failed = results.filter((r) => r.status === "rejected").length;

            res.json({ success: true, deleted, failed });
        } catch (error) {
            console.error("Error bulk deleting assets:", error);
            res.status(500).json({ success: false, message: "Failed to delete assets" });
        }
    }
);

// Optimize assets (images and videos)
router.post(
    "/optimize",
    authenticate,
    requireRoleOrPermission([Role.ADMIN], Permission.UPLOADS),
    async (req, res) => {
        try {
            const { filenames } = req.body as { filenames?: string[] };

            // Get list of files to optimize
            let targetFiles: string[];
            if (filenames && Array.isArray(filenames) && filenames.length > 0) {
                targetFiles = filenames;
            } else {
                targetFiles = await fs.promises.readdir(UPLOADS_DIR);
            }

            const results = {
                optimized: [] as string[],
                skipped: [] as string[],
                failed: [] as string[],
            };

            for (const filename of targetFiles) {
                const filepath = path.join(UPLOADS_DIR, filename);

                // Security check
                if (!filepath.startsWith(UPLOADS_DIR)) {
                    results.failed.push(filename);
                    continue;
                }

                try {
                    const stats = await fs.promises.stat(filepath);
                    const ext = path.extname(filename).toLowerCase();
                    const isImage = [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
                    const isVideo = [".mp4", ".webm", ".ogg"].includes(ext);

                    if (isImage) {
                        // Skip if already under 500KB
                        if (stats.size <= 500 * 1024) {
                            results.skipped.push(filename);
                            continue;
                        }

                        // Convert to WebP for better compression
                        const baseName = filename.replace(ext, "");
                        const webpFilename = baseName + ".webp";
                        const webpPath = path.join(UPLOADS_DIR, webpFilename);

                        // Convert to WebP with quality 80 and resize if larger than 1200px
                        const command = `convert "${filepath}" -resize "1200x1200>" -quality 80 -strip "${webpPath}"`;

                        await execAsync(command);

                        // Check if WebP file was created and is smaller
                        try {
                            const newStats = await fs.promises.stat(webpPath);
                            if (newStats.size < stats.size) {
                                // Delete original file if not already webp
                                if (ext !== ".webp") {
                                    await fs.promises.unlink(filepath);
                                }

                                // Update database URLs that reference this file (ProductImage table)
                                const likePattern = `%${filename}`;
                                const updateResult = await prisma.$executeRaw`UPDATE "ProductImage" SET url = REPLACE(url, ${filename}, ${webpFilename}) WHERE url LIKE ${likePattern}`;
                                console.log(`Updated ${updateResult} ProductImage URLs: ${filename} → ${webpFilename}`);

                                results.optimized.push(filename + " → " + webpFilename);
                            } else {
                                // WebP is not smaller, keep original
                                await fs.promises.unlink(webpPath);
                                results.skipped.push(filename);
                            }
                        } catch (err) {
                            console.error(`Error optimizing ${filename}:`, err);
                            results.failed.push(filename);
                        }
                    } else if (isVideo) {
                        // Skip if already under 2MB
                        if (stats.size <= 2 * 1024 * 1024) {
                            results.skipped.push(filename);
                            continue;
                        }

                        // Calculate target bitrate for ~2MB file
                        // Get duration first
                        const durationCmd = `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filepath}"`;
                        const { stdout: durationStr } = await execAsync(durationCmd);
                        const duration = parseFloat(durationStr.trim()) || 30;

                        // Target ~1.8MB to have some margin
                        const targetSizeBits = 1.8 * 1024 * 1024 * 8;
                        const targetBitrate = Math.floor(targetSizeBits / duration);
                        const videoBitrate = Math.max(100000, Math.min(targetBitrate * 0.9, 1000000));
                        const audioBitrate = 64000;

                        const tempPath = filepath.replace(ext, ".optimized" + ext);
                        const command = `ffmpeg -y -i "${filepath}" -vcodec libx264 -b:v ${videoBitrate} -acodec aac -b:a ${audioBitrate} -vf "scale=720:-2" "${tempPath}"`;

                        await execAsync(command);

                        const newStats = await fs.promises.stat(tempPath);
                        if (newStats.size < stats.size) {
                            await fs.promises.rename(tempPath, filepath);
                            results.optimized.push(filename);
                        } else {
                            await fs.promises.unlink(tempPath);
                            results.skipped.push(filename);
                        }
                    } else {
                        results.skipped.push(filename);
                    }
                } catch (err) {
                    console.error(`Error optimizing ${filename}:`, err);
                    results.failed.push(filename);
                }
            }

            res.json({ success: true, ...results });
        } catch (error) {
            console.error("Error optimizing assets:", error);
            res.status(500).json({ success: false, message: "Failed to optimize assets" });
        }
    }
);

export default router;
