import type { Metadata } from 'next';

import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  return <LoginForm />;
}
