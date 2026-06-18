'use client';

import dynamic from 'next/dynamic';

const AuthProviderWrapper = dynamic(
  () => import('./auth-provider-wrapper'),
  { ssr: false }
);

export default AuthProviderWrapper;
