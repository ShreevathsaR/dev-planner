var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma, Prisma } from "@dev-planner/prisma";
import { TRPCError, protectedProcedure, router } from "../trpc";
import { createProjectSchema } from "@dev-planner/schema";
export const projectRouter = router({
    createProject: protectedProcedure
        .input(createProjectSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { name, createdBy } = input;
        if (!name || !createdBy) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Name and createdBy are required",
            });
        }
        try {
            const project = yield prisma.project.create({
                data: input,
            });
            return {
                success: true,
                message: "Project created successfully",
                data: project,
            };
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new TRPCError({
                    code: "NOT_IMPLEMENTED",
                    message: "Project creation failed",
                });
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                cause: error,
            });
        }
    })),
    userProjects: protectedProcedure.query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, }) {
        const { user } = ctx;
        try {
            const rawProjects = yield prisma.project.findMany({
                where: {
                    createdBy: user.uid,
                },
            });
            const projects = rawProjects.map((project) => (Object.assign(Object.assign({}, project), { details: project.details })));
            return {
                success: true,
                message: `Projects fetched successfully for ${user.email}`,
                data: projects,
            };
        }
        catch (error) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new TRPCError({
                    code: "NOT_IMPLEMENTED",
                    message: "Failed fetching projects from database",
                });
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                cause: error,
            });
        }
    })),
    testProject: protectedProcedure.query(({ ctx }) => {
        var _a;
        return `Hello ${(_a = ctx.user) === null || _a === void 0 ? void 0 : _a.email}`;
    }),
});
