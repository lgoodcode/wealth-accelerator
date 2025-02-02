'use client';

import Image from 'next/image';
import Link from 'next/link';
import { captureException } from '@sentry/nextjs';

import { Header } from '@/components/public/header';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/public/footer';

export default function InternalErrorPage({ error, reset }: any) {
  captureException(error);

  return (
    <>
      <Header />

      <div className="container h-full flex-grow grid grid-cols-2 mt-12 lg:mt-0 py-32 gap-12 lg:gap-8 ">
        <div className="md:container col-span-2 lg:col-span-1 my-auto space-y-6">
          <div>
            <h1 className="text-4xl font-semibold leading-snug">Something went wrong</h1>
            <p className="text-lg text-muted-foreground">
              Try reloading the content or navigate to a different page or refresh the page.
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={reset}>Reload</Button>
            <Button>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
          <Image
            src="/img/500-dog.png"
            alt="500 error dog with computer - Image by storyset on Freepik"
            className="max-w-lg lg:max-w-none"
            width={668}
            height={668}
            priority
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
