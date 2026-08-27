import { NeonAuthView } from '@/components/neon-auth-ui-client';

export const dynamicParams = false;

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  return (
    <main className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[400px]">
        <NeonAuthView path={path} />
      </div>
    </main>
  );
}
