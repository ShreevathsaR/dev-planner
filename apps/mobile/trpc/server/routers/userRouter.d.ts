export declare const userRouter: import("@trpc/server").TRPCBuiltRouter<{
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
