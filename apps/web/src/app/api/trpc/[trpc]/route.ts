import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter,createTrpcContext } from '@dev-planner/trpc/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTrpcContext,
  });
}
export { handler as GET, handler as POST };