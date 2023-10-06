import { headers } from 'next/headers';
import type { Metadata } from 'next';

import { SetPasswordForm } from './set-password-form';

export const metadata: Metadata = {
  title: 'Set Password',
};

export default function SetPasswordPage() {
  console.log(headers().get('x-url'));
  return <SetPasswordForm />;
}

// if ((window && !window.location.hash) || !window.location.hash.startsWith('#access_token')) {
//   router.replace('/login');
// }
