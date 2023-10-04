'use client';

import Image from 'next/image';
import Link from 'next/link';
import { captureException } from '@sentry/nextjs';

import { Header } from '@/components/public/header';
import { Button } from '@/components/ui/button';

export default function InternalErrorPage({ error, reset }: any) {
  captureException(error);

  return (
    <>
      <Header />

      <div className="container h-full mt-24 lg:mt-0 flex-grow grid grid-cols-2 gap-8">
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
            width={668}
            height={668}
            priority
          />
        </div>
      </div>
    </>
  );
}
