import * as z from "zod";

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  name: z
    .string()
    .min(2, "Username must contain 2 characters atleast")
    .max(20, "Username must contain less that 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),
  image: z.string().url({ message: "Invalid image url" }).optional(),
});

export type SignUpFormType = typeof signUpSchema