import { authApiHandler } from '@neondatabase/auth/next/server';

// Handle all Neon Auth API requests
// The catch-all route [...path] will match all paths under /api/auth/*
// This handles endpoints like /api/auth/session, /api/auth/sign-in, etc.
export const { GET, POST } = authApiHandler();
