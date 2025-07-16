import * as z from "zod";
export declare const signUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    image?: string | undefined;
    id?: string | undefined;
}, {
    email: string;
    password: string;
    name: string;
    image?: string | undefined;
    id?: string | undefined;
}>;
export type SignUpFormType = typeof signUpSchema;
