import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@dev-planner/prisma";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    emailAndPassword:{
        enabled: true
    },
    // socialProviders:{
    //     google:{
    //         clientId:"",
    //         clientSecret:"",
    //     }
    // },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
});