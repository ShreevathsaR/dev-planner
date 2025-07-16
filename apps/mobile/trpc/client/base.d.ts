import type { AppRouter } from "../server/router";
export declare const createTRPCBaseClient: (url: string) => import("@trpc/client").TRPCClient<import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        user: any;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    user: import("@trpc/server").TRPCBuiltRouter<{
        ctx: {
            user: any;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        registerUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                email: string;
                image: string;
                id: string;
            };
            output: {
                success: boolean;
                message: string;
                user: {
                    name: string;
                    email: string;
                    image: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            };
            meta: object;
        }>;
        testUser: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: string;
            meta: object;
        }>;
    }>>;
    projects: import("@trpc/server").TRPCBuiltRouter<{
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
                    details: import("@dev-planner/prisma/generated/client/runtime/library").JsonValue | null;
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
                data: import("../server/types").ProjectWithTypedDetails[];
            };
            meta: object;
        }>;
        testProject: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: string;
            meta: object;
        }>;
    }>>;
}>>>;
export type { AppRouter };
