import { authApiHandler } from '@neondatabase/auth/next/server';

// Proxies auth requests from the client to Neon Auth.
// Note: do not log request URLs here — auth callbacks can carry session
// verifiers/tokens in the query string.
type RouteContext = { params: Promise<{ path: string[] }> };

export const GET = async (request: Request, context: RouteContext) => {
  const handler = authApiHandler();
  return handler.GET(request, context);
};

export const POST = async (request: Request, context: RouteContext) => {
  const handler = authApiHandler();
  return handler.POST(request, context);
};
