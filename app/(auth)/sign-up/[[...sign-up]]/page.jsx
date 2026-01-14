import { AuthView } from '@neondatabase/auth/react';

export default function SignUpPage() {
  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthView path="sign-up" />
    </main>
  );
}
