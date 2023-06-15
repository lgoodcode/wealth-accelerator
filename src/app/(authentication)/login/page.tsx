import { Metadata } from 'next'

import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login',
}

export default async function LoginPage() {
  return <LoginForm />
}
