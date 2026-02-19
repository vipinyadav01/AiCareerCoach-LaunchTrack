import { authApiHandler } from '@neondatabase/auth/next/server';

export const GET = async (request, context) => {
  console.log('Auth GET request:', request.url);
  const handler = authApiHandler();
  return handler.GET(request, context);
};

export const POST = async (request, context) => {
  console.log('Auth POST request:', request.url);
  const handler = authApiHandler();
  return handler.POST(request, context);
};
