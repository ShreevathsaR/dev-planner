import { PrismaClient } from "./generated/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const extendedPrisma = new PrismaClient().$extends(withAccelerate());
type ExtendedPrismaClient = typeof extendedPrisma;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: ExtendedPrismaClient;
};

export const prisma: ExtendedPrismaClient =
  globalForPrisma.prisma ?? extendedPrisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}