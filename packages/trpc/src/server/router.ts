import { initTRPC } from "@trpc/server";
import * as z from "zod";
import { signUpSchema } from "@dev-planner/schema";
import { prisma } from "@dev-planner/prisma";
const t = initTRPC.create();

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

export const appRouter = router({
  test: procedure
    .input((name: unknown) => {
      if (typeof name === "string") return name;

      throw new Error(`Input ${name} is not a string`);
    })
    .query(({ input }) => {
      return {
        greeting: `Hello ${input}`,
      };
    }),
  registerUser: procedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        image: z.string().url("Invalid image URL"),
        id: z.string().min(1, "Id is required"),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, image, id } = input;
      const user = await prisma.user.upsert({
        create: {
          id,
          name,
          email,
          image,
        },
        update: {
          name,
          email,
          image,
        },
        where: {
          id,
        },
      });
      console.log(user);
      return user;
    }),
});

export type AppRouter = typeof appRouter;
