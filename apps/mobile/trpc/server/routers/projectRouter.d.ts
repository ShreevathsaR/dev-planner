import { Prisma } from "@dev-planner/prisma";
import { ProjectWithTypedDetails } from "../types";
export declare const projectRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        user: any;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    createProject: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            createdBy: string;
            description?: string | undefined;
            details?: {
                teamSize?: number | undefined;
                skills?: string[] | undefined;
                budget?: "low" | "medium" | "high" | undefined;
                timeline?: string | undefined;
            } | undefined;
        };
        output: {
            success: boolean;
            message: string;
            data: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                details: Prisma.JsonValue | null;
                createdBy: string;
            };
        };
        meta: object;
    }>;
    userProjects: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            success: boolean;
            message: string;
            data: ProjectWithTypedDetails[];
        };
        meta: object;
    }>;
    testProject: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: string;
        meta: object;
    }>;
}>>;
