import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@dev-planner/trpc/server';
function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
  });
}
export { handler as GET, handler as POST };