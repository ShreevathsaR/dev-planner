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
  getMessages: protectedProcedure.input(z.object({ projectId: z.string()})).query(async ({ input }) => {
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
  testProject: protectedProcedure.query(({ ctx }) => {
    return `Hello ${ctx.user?.email}`;
  }),
}) satisfies any;
