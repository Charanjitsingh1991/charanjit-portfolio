const { execFileSync } = require("node:child_process");

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not configured; skipping production database setup.");
  process.exit(0);
}

const runNode = (args) =>
  execFileSync(process.execPath, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

console.log("Applying production database migrations...");
runNode([require.resolve("prisma/build/index.js"), "migrate", "deploy"]);

console.log("Importing the default portfolio catalog...");
runNode(["scripts/run-typescript.cjs", "prisma/seed.ts"]);
