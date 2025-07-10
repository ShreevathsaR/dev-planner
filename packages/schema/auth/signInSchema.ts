import * as z from "zod"

export const signInSchema = z.object({
    email: z.string().email({message: "Invalid email address"}).nonempty({message: "Email is required"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}).nonempty({message: "Password is required"}).max(20, {message: "Password must be less than 20 characters long"})
})

export type SignInFormType = typeof signInSchema