'use client';

import { NeonAuthUIProvider, AuthView, AccountView, UserButton } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';

/**
 * The Neon Auth UI provider is only needed by the auth UI widgets (AuthView,
 * AccountView, UserButton) — NOT by `authClient.useSession()`. It also renders
 * a helper <script>, which breaks hydration if server-rendered, so these
 * wrappers keep it scoped to the widgets and are loaded client-only (see
 * neon-auth-ui-client.jsx). The rest of the app server-renders cleanly.
 */
function AuthUIProvider({ children }) {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      emailOTP
      social={{ providers: ['google'] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}

export function NeonAuthView({ path }) {
  return (
    <AuthUIProvider>
      <AuthView path={path} />
    </AuthUIProvider>
  );
}

export function NeonAccountView({ path }) {
  return (
    <AuthUIProvider>
      <AccountView path={path} />
    </AuthUIProvider>
  );
}

export function NeonUserButtonInner(props) {
  return (
    <AuthUIProvider>
      <UserButton size="icon" {...props} />
    </AuthUIProvider>
  );
}
