import { NeonAccountView } from '@/components/neon-auth-ui-client';
import { accountViewPaths } from '@neondatabase/auth/react/ui/server';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="container p-4 md:p-6">
      <NeonAccountView path={path} />
    </main>
  );
}
