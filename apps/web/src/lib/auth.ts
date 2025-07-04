import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@dev-planner/prisma";
import { nextCookies } from "better-auth/next-js";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    emailAndPassword:{
        enabled: true
    },
    socialProviders:{
        google:{
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret:process.env.GOOGLE_CLIENT_SECRET || "",
        }
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    plugins:[nextCookies()]
});