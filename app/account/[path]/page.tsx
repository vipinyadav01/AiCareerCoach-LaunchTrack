import { NeonAccountView } from '@/components/neon-auth-ui-client';
import { accountViewPaths } from '@neondatabase/auth/react/ui/server';
import { PageHeader, Screen } from '@/components/app/screen';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <Screen className="max-w-4xl">
      <PageHeader title="Account" description="Your sign-in details, security and connected access." />
      <NeonAccountView path={path} />
    </Screen>
  );
}
