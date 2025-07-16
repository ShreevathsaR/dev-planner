import { adminAuth } from "./firebase-admin";

export async function createTrpcContext({ req }: { req: Request }) {
  const token = req.headers.get('authorization')?.split("Bearer ")[1];

  let user = null;

  if (token) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      user = decodedToken;
    } catch (err) {
      console.warn("Invalid Firebase token", err);
    }
  }

  return {
    user,
  };
}

export type ContextTRPC = Awaited<ReturnType<typeof createTrpcContext>>;
