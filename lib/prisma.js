import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query"] : [],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Add connection error handler
db.$connect().catch(() => {
  // Silently handle connection errors to prevent app crash
  // Database operations will fail gracefully with their own error handling
});

// globalThis.prisma: this global version ensures that the prisma client instance is reused across hot reloads during development.