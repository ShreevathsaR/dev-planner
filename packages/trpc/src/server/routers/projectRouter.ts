import { prisma, Prisma } from "@dev-planner/prisma";
import { TRPCError, protectedProcedure, router } from "../trpc";
import { createProjectSchema } from "@dev-planner/schema";

export const projectRouter = router({
  createProject: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      const { name, createdBy } = input;

      if (!name || !createdBy) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name and createdBy are required",
        });
      }

      try {
        const project = await prisma.project.create({
          data: input,
        });
        return { success: true, message: "Project created successfully", data: project};
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError) {
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
    }),
  testProject: protectedProcedure.query(({ctx}) => {
    return `Hello ${ctx.user?.email}`;
  }),
}) satisfies any;
