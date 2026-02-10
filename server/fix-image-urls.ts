import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function fixUrls() {
    const uploadsDir = "./uploads";
    const files = fs.readdirSync(uploadsDir);
    const webpFiles = files.filter((f: string) => f.endsWith(".webp"));

    console.log("Found", webpFiles.length, "webp files in uploads");

    // Get all product images
    const images = await prisma.productImage.findMany();
    console.log("Found", images.length, "product images in database");

    let fixed = 0;

    for (const img of images) {
        const url = img.url;
        // Extract filename from URL
        const urlParts = url.split("/uploads/");
        if (urlParts.length < 2) continue;

        const filename = urlParts[1];
        const ext = path.extname(filename);

        if (ext !== ".webp") {
            // Check if webp version exists
            const baseName = filename.replace(ext, "");
            const webpFilename = baseName + ".webp";

            if (webpFiles.includes(webpFilename)) {
                const newUrl = url.replace(filename, webpFilename);
                await prisma.productImage.update({
                    where: { id: img.id },
                    data: { url: newUrl }
                });
                console.log("Fixed:", filename, "->", webpFilename);
                fixed++;
            } else {
                // Check if original file exists
                if (!files.includes(filename)) {
                    console.log("MISSING:", filename, "(no webp, no original)");
                }
            }
        }
    }

    console.log("Total fixed:", fixed);
    await prisma.$disconnect();
}

fixUrls().catch(console.error);
