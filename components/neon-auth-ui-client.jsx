'use client';

import dynamic from 'next/dynamic';

// Client-only loaders for the Neon Auth UI widgets. `ssr: false` keeps the
// provider's helper <script> off the server so it never causes a hydration
// mismatch; these widgets are interactive and don't need SSR/SEO anyway.
const AuthSkeleton = () => (
  <div className="h-72 w-full animate-pulse rounded-xl bg-black/[0.04]" />
);

export const NeonAuthView = dynamic(
  () => import('./neon-auth-ui').then((m) => ({ default: m.NeonAuthView })),
  { ssr: false, loading: AuthSkeleton }
);

export const NeonAccountView = dynamic(
  () => import('./neon-auth-ui').then((m) => ({ default: m.NeonAccountView })),
  { ssr: false, loading: AuthSkeleton }
);

export const NeonUserButton = dynamic(
  () => import('./neon-auth-ui').then((m) => ({ default: m.NeonUserButtonInner })),
  { ssr: false, loading: () => <div className="h-8 w-8 rounded-full bg-black/[0.06]" /> }
);
