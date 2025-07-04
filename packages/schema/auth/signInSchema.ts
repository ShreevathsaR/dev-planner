import * as z from "zod"

export const signInSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty({message: "Password cannot be empty"})
})

export type SignInFormType = typeof signInSchema