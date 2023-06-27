import type { Metadata } from 'next';

import { RegisterForm } from './register-form';

export const metadata: Metadata = {
  title: 'Sign Up',
};

// Statically generate the page at build time.
export const dynamic = 'force-static';

export default function SignUpPage() {
  return <RegisterForm />;
}
