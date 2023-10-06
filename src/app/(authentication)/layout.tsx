import Link from 'next/link';
import Image from 'next/image';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthHelper } from './auth-helper';

interface AuthenticationLayoutProps {
  children: React.ReactNode;
}

export default async function AuthenticationLayout({ children }: AuthenticationLayoutProps) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <AuthHelper />

      <div className="relative grid xl:grid-cols-2 justify-center">
        <Image
          src="/img/himalayas.jpg"
          alt="mountain covered by fog"
          priority
          fill
          className="object-cover"
        />

        <div className="col-start-2 min-h-screen flex flex-col items-center justify-center">
          <div className="px-8 py-12 w-[480px] rounded-md flex flex-col bg-white/90 bd-frost shadow-2xl">
            <Link href="/" className="mb-6">
              <Image
                src="/img/logo-318x85.png"
                alt="logo"
                className="mx-auto"
                priority
                width={270}
                height={70}
              />
            </Link>

            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
