import * as z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(4, 'Project name should contain atleast 4 characters').max(30, 'Project name should contain atmost 30 characters'),
  createdBy: z.string().min(1, 'Created by should not be empty'),
  description: z.string().optional(),
  details: z.object({
    teamSize: z.number().int().positive().optional(),
    skills: z.array(z.string()).optional(),
    budget: z.enum(['low','medium', 'high']).optional(),
    timeline: z.string().optional(),
  }).optional(),
});

export type CreateProjectSchemaType = typeof createProjectSchema;
