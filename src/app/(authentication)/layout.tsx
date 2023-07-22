import Image from 'next/image';
// import Link from 'next/link';

import { supabaseAdmin } from '@/lib/supabase/server/admin';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthHelper } from './auth-helper';

const useDevEmails = async () => {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  const { error, data } = await supabaseAdmin.from('users').select('email');

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((user) => user.email);
};

interface AuthenticationLayoutProps {
  children: React.ReactNode;
}

export default async function AuthenticationLayout({ children }: AuthenticationLayoutProps) {
  const devEmails = await useDevEmails();

  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <AuthHelper devEmails={devEmails} />

      <div className="container relative flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="hidden -z-10 absolute w-full h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <Image
            src="/img/bg-auth.jpg"
            alt="mountain covered by fog"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="lg:p-8 col-start-2 bg-white min-h-screen flex flex-col items-center justify-center">
          <div className="mx-auto lg:p-8 lg:py-12 rounded-md bg-white flex w-full flex-col justify-center space-y-6 sm:w-[480px]">
            <Image
              src="/img/logo-318x85.png"
              width={270}
              height={70}
              alt="logo"
              priority
              className="mx-auto"
              style={{
                width: 270,
                height: 70,
              }}
            />

            {children}

            {/* <p className="px-8 text-center text-sm text-muted-foreground">
              By using our website, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p> */}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
