import { prisma, Prisma } from "@dev-planner/prisma";
import { TRPCError, protectedProcedure, trouter } from "../trpc";
import { createProjectSchema, createMessageSchema } from "@dev-planner/schema";
import { ProjectDetails, ProjectWithTypedDetails } from "../types";
import * as z from "zod";

export const projectRouter = trouter({
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
        return {
          success: true,
          message: "Project created successfully",
          data: project,
        };
      } catch (error) {
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
    }),
  getProjects: protectedProcedure.query(
    async ({
      ctx,
    }): Promise<{
      success: boolean;
      message: string;
      data: ProjectWithTypedDetails[];
    }> => {
      const { user } = ctx;

      try {
        const rawProjects = await prisma.project.findMany({
          where: {
            createdBy: user.uid,
          },
        });

        const projects: ProjectWithTypedDetails[] = rawProjects.map(
          (project) => ({
            ...project,
            details: project.details as ProjectDetails | null,
          })
        );

        return {
          success: true,
          message: `Projects fetched successfully for ${user.email}`,
          data: projects,
        };
      } catch (error) {
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
    }
  ),
  createMessage: protectedProcedure
    .input(createMessageSchema)
    .mutation(async ({ input }) => {
      const { content, projectId } = input;

      try {
        const message = await prisma.chatMessage.create({
          data: {
            content,
            projectId,
            role: "user",
          },
        });

        return {
          success: true,
          message: `Message created successfully`,
          data: message,
        };
      } catch (error) {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "Failed creating message",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
  getMessages: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const { projectId } = input;
      try {
        const messages = await prisma.chatMessage.findMany({
          where: {
            projectId,
          },
        });
        return {
          success: true,
          message: `Messages fetched successfully`,
          data: messages,
        };
      } catch (error) {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "Failed fetching messages",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
  updateProjectDecisions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        decisions: z.array(
          z.object({
            category: z.string(),
            key: z.string(),
            value: z.string(),
            reason: z.string(),
            confidence_score: z.number().min(0).max(1),
            recommendation: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { projectId, decisions } = input;

      console.log("Decisions", decisions);

      try {
        await Promise.all(
          decisions.map((decision) =>
            prisma.decision.upsert({
              where: {
                projectId_category_key: {
                  projectId,
                  category: decision.category,
                  key: decision.key,
                },
              },
              update: {
                key: decision.key,
                value: decision.value,
                reason: decision.reason,
                confidence_score: decision.confidence_score,
                recommendation: decision.recommendation,
              },
              create: {
                projectId,
                category: decision.category,
                key: decision.key,
                value: decision.value,
                reason: decision.reason,
                confidence_score: decision.confidence_score,
                recommendation: decision.recommendation,
              },
            })
          )
        );

        return {
          success: true,
          message: "Project decisions updated successfully",
        };
      } catch (error) {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "Failed updating project decisions",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
  getDecisions: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const { projectId } = input;
      try {
        const decisions = await prisma.decision.findMany({
          where: {
            projectId,
          },
        });
        return {
          success: true,
          message: "Project decisions fetched successfully",
          data: decisions,
        };
      } catch (error) {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "Failed fetching project decisions",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
  testProject: protectedProcedure.query(({ ctx }) => {
    return `Hello ${ctx.user?.email}`;
  }),
}) satisfies any;
