import * as z from "zod";
export declare const createProjectSchema: z.ZodObject<{
    name: z.ZodString;
    createdBy: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodObject<{
        teamSize: z.ZodOptional<z.ZodNumber>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        budget: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        timeline: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
    }, {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
    }>>;
    customContext: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    createdBy: string;
    description?: string | undefined;
    details?: {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
    } | undefined;
    customContext?: string | undefined;
}, {
    name: string;
    createdBy: string;
    description?: string | undefined;
    details?: {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
    } | undefined;
    customContext?: string | undefined;
}>;
export declare const projectSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    createdBy: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodObject<{
        teamSize: z.ZodOptional<z.ZodNumber>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        budget: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        timeline: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
    }, {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
    }>>;
    customContext: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    createdBy: string;
    customContext: string;
    description?: string | undefined;
    details?: {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
    } | undefined;
}, {
    name: string;
    id: string;
    createdBy: string;
    customContext: string;
    description?: string | undefined;
    details?: {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
    } | undefined;
}>;
export declare const createMessageSchema: z.ZodObject<{
    projectId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    content: string;
}, {
    projectId: string;
    content: string;
}>;
export type CreateProjectSchemaType = typeof createProjectSchema;
