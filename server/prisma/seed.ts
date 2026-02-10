import { PrismaClient, Role } from "@prisma/client";
import { config as loadEnv } from "dotenv";
import { hashPassword } from "../src/utils/password";

loadEnv();

const prisma = new PrismaClient();

const ADMIN_USERNAME = "admin";
const ADMIN_EMAIL = "admin@meghdoot.com";
const ADMIN_PASSWORD = "AdminMegh1412@4";

const UPLOADER_USERNAME = "uploadadmin";
const UPLOADER_EMAIL = "uploadadmin@meghdoot.com";
// Password as requested by client
const UPLOADER_PASSWORD = "uploadamdin1241252$%";

async function main() {
  // Ensure admin user exists
  const existingAdmin = await prisma.user.findFirst({
    where: { OR: [{ username: ADMIN_USERNAME }, { email: ADMIN_EMAIL }] },
  });
  if (!existingAdmin) {
    const adminHash = await hashPassword(ADMIN_PASSWORD);
    await prisma.user.create({
      data: {
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        passwordHash: adminHash,
        role: Role.ADMIN,
        fullName: "Meghdoot Admin",
      },
    });
    console.log("Admin user created with username 'admin'.");
  } else {
    console.log("Admin account already exists. Skipping admin creation.");
  }

  // Ensure uploader user exists
  const existingUploader = await prisma.user.findFirst({
    where: { OR: [{ username: UPLOADER_USERNAME }, { email: UPLOADER_EMAIL }] },
  });
  if (!existingUploader) {
    const uploaderHash = await hashPassword(UPLOADER_PASSWORD);
    await prisma.user.create({
      data: {
        username: UPLOADER_USERNAME,
        email: UPLOADER_EMAIL,
        passwordHash: uploaderHash,
        role: Role.UPLOADER,
        fullName: "Catalog/Products Uploader",
      },
    });
    console.log("Uploader user created with username 'uploadadmin'.");
  } else {
    // Ensure role is UPLOADER even if account pre-existed as USER
    if (existingUploader.role !== Role.UPLOADER) {
      await prisma.user.update({
        where: { id: existingUploader.id },
        data: { role: Role.UPLOADER },
      });
      console.log("Uploader account role updated to UPLOADER.");
    } else {
      console.log("Uploader account already exists with correct role.");
    }
  }

  // Ensure default categories exist
  const defaultCategories = [
    "Sarees",
    "Eco And Jewellery",
    "Kurtis",
    "Salwars",
    "Indo-Western",
    "Fabrics",
  ];
  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Default categories ensured:", defaultCategories.join(", "));
}

main()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
