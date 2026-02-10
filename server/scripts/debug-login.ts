import { config as loadEnv } from "dotenv";
loadEnv({ path: "./.env" });
import { AuthService } from "../src/services/auth.service";

async function main() {
  const identifier = process.argv[2];
  const password = process.argv[3];
  if (!identifier || !password) {
    console.error("Usage: tsx scripts/debug-login.ts <identifier> <password>");
    process.exit(1);
  }
  try {
    const user = await AuthService.login({ identifier, password });
    console.log("Login OK:", {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    });
    process.exit(0);
  } catch (err) {
    console.error("Login error:", err);
    process.exit(2);
  }
}

main();

