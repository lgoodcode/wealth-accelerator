import type { Metadata } from 'next';

import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Login',
};

// Statically generate the page at build time.
export const dynamic = 'force-static';

export default async function LoginPage() {
  return <LoginForm />;
}
