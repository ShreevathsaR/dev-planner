var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as z from "zod";
import { prisma, Prisma } from "@dev-planner/prisma";
import { TRPCError, procedure, router } from "../trpc";
export const userRouter = router({
    registerUser: procedure
        .input(z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        image: z.string().url("Invalid image URL"),
        id: z.string().min(1, "Id is required"),
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { name, email, image, id } = input;
        try {
            const user = yield prisma.user.create({
                data: {
                    id,
                    name,
                    email,
                    image,
                },
            });
            return { success: true, message: "User registered successfully", user };
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User already exists",
                });
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                cause: error,
            });
        }
    })),
    testUser: procedure.query(() => {
        return "Hi";
    }),
});
