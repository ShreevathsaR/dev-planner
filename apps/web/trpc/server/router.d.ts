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
                    style: string | null;
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
                    details: import("@dev-planner/prisma/generated/client/runtime/library").JsonValue | null;
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
                data: import("@dev-planner/prisma/generated/client/runtime/library").DynamicModelExtensionFluentApi<import("@dev-planner/prisma").Prisma.TypeMap<import("@dev-planner/prisma/generated/client/runtime/library").InternalArgs & {
                    result: {};
                    model: {
                        $allModels: {
                            aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                            count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                            findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                            findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                            findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                            findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                            findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                            groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
                        };
                        user: {
                            aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                            count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                            findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                            findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                            findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                            findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                            findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                            groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
                        };
                        project: {
                            aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                            count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                            findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                            findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                            findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                            findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                            findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                            groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
                        };
                        chatMessage: {
                            aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                            count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                            findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                            findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                            findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                            findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                            findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                            groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
                        };
                        decision: {
                            aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                            count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                            findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                            findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                            findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                            findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                            findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                                select: unknown;
                                include: unknown;
                            } ? "Please either choose `select` or `include`." : ActualArgs extends {
                                select: unknown;
                                omit: unknown;
                            } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                            groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
                        };
                    };
                    query: {};
                    client: {
                        $accelerate: () => {
                            invalidate: (input: import("@prisma/extension-accelerate").AccelerateInvalidateInput) => Promise<{
                                requestId: string;
                            }>;
                            invalidateAll: () => Promise<{
                                requestId: string;
                            }>;
                        };
                    };
                }, {}>, "Project", "update", never> & import("@dev-planner/prisma/generated/client/runtime/library").PrismaPromise<{
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    details: import("@dev-planner/prisma/generated/client/runtime/library").JsonValue | null;
                    customContext: string | null;
                    createdBy: string;
                }>;
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
