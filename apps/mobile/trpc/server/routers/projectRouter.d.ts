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
            customContext?: string | undefined;
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
                customContext: string | null;
                createdBy: string;
            };
        };
        meta: object;
    }>;
    getProjects: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            success: boolean;
            message: string;
            data: ProjectWithTypedDetails[];
        };
        meta: object;
    }>;
    createMessage: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            projectId: string;
            content: string;
        };
        output: {
            success: boolean;
            message: string;
            data: {
                projectId: string;
                id: string;
                createdAt: Date;
                role: string;
                content: string;
                metadata: string | null;
            };
        };
        meta: object;
    }>;
    getMessages: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            projectId: string;
        };
        output: {
            success: boolean;
            message: string;
            data: any[];
        };
        meta: object;
    }>;
    updateProjectDecisions: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            projectId: string;
            decisions: {
                value: string;
                category: string;
                key: string;
                reason: string;
                confidence_score: number;
                recommendation: string;
            }[];
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    getDecisions: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            projectId: string;
        };
        output: {
            success: boolean;
            message: string;
            data: {
                projectId: string;
                value: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                key: string;
                reason: string | null;
                confidence_score: number;
                recommendation: string | null;
            }[];
        };
        meta: object;
    }>;
    updateProject: import("@trpc/server").TRPCMutationProcedure<{
        input: {
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
                customContext: string | null;
                createdBy: string;
            };
        };
        meta: object;
    }>;
    testProject: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: string;
        meta: object;
    }>;
}>>;
