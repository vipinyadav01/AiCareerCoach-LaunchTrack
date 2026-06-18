'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';

export default function AuthProviderWrapper({ children }) {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      emailOTP
      social={{
        providers: ['google']
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
