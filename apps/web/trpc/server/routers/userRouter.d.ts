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
