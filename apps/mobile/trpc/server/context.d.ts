export declare function createContext({ req }: {
    req: Request;
}): Promise<{
    user: any;
}>;
export type Context = Awaited<ReturnType<typeof createContext>>;
