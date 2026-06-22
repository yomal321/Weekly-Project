// src/lib/db.ts
// Prisma client singleton — shared across all API routes
// ADR-002: SQLite via Prisma ORM
// ST-03: This file is imported by all API routes

import { PrismaClient } from "@prisma/client";

// Prevent multiple Prisma instances in development (Next.js hot reload creates new instances)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}