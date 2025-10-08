import { PrismaClient, Role } from "@prisma/client";
import { config as loadEnv } from "dotenv";
import { hashPassword } from "../src/utils/password";
loadEnv();
const prisma = new PrismaClient();
const ADMIN_USERNAME = "admin";
const ADMIN_EMAIL = "admin@meghdoot.com";
const ADMIN_PASSWORD = "AdminMegh1412@4";
async function main() {
    const existingAdmin = await prisma.user.findFirst({
        where: {
            OR: [{ username: ADMIN_USERNAME }, { email: ADMIN_EMAIL }],
        },
    });
    if (existingAdmin) {
        console.log("Admin account already exists. Skipping admin seed.");
        return;
    }
    const passwordHash = await hashPassword(ADMIN_PASSWORD);
    await prisma.user.create({
        data: {
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL,
            passwordHash,
            role: Role.ADMIN,
            fullName: "Meghdoot Admin",
        },
    });
    console.log("Admin user created with username 'admin'.");
}
main()
    .catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
