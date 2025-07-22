export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
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
                id: string;
                name: string;
                email: string;
                image: string;
            };
            output: {
                success: boolean;
                message: string;
                user: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    image: string | null;
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
    projectsRouter: import("@trpc/server").TRPCBuiltRouter<{
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
                    id: string;
                    name: string;
                    description: string | null;
                    details: import("@dev-planner/prisma/generated/client/runtime/library").JsonValue | null;
                    createdAt: Date;
                    updatedAt: Date;
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
                data: import("./types").ProjectWithTypedDetails[];
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
                data: {
                    projectId: string;
                    id: string;
                    createdAt: Date;
                    role: string;
                    content: string;
                    metadata: string | null;
                }[];
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
                    value: string;
                    projectId: string;
                    category: string;
                    key: string;
                    reason: string | null;
                    confidence_score: number;
                    recommendation: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                }[];
            };
            meta: object;
        }>;
        testProject: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: string;
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
