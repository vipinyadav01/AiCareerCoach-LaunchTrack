import { notFound } from 'next/navigation';
import { NeonAccountView } from '@/components/neon-auth-ui-client';
import { accountViewPaths } from '@neondatabase/auth/react/ui/server';
import { PageHeader, Screen } from '@/components/app/screen';

// Rendered per request: the signed-in layout reads the session.
export const dynamic = 'force-dynamic';

const validPaths = new Set<string>(Object.values(accountViewPaths));

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  if (!validPaths.has(path)) notFound();

  return (
    <Screen>
      <PageHeader title="Account" description="Your sign-in details, security and connected access." />
      <NeonAccountView path={path} />
    </Screen>
  );
}
