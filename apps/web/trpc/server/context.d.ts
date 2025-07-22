export declare function createTrpcContext({ req }: {
    req: Request;
}): Promise<{
    user: any;
}>;
export type ContextTRPC = Awaited<ReturnType<typeof createTrpcContext>>;
