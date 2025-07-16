import { createTRPCClient, httpLink } from "@trpc/client";
export const createTRPCBaseClient = (url) => {
    return createTRPCClient({
        links: [
            httpLink({
                url,
            }),
        ],
    });
};
