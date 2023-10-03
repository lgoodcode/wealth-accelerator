'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { captureException } from '@sentry/nextjs';

import { Button } from '@/components/ui/button';

export default function InternalErrorPage({ error, reset }: any) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleReset = () => {
    setIsRetrying(true);
    reset();
  };
  const handleGoHome = () => {
    setIsLoading(true);
    router.push('/dashboard/home');
  };

  captureException(error);

  return (
    <div className="container font-sans mt-32 grid grid-cols-2 gap-8 lg:gap-0">
      <div className="col-span-2 lg:col-span-1 my-auto space-y-6">
        <div>
          <h1 className="text-4xl font-semibold leading-snug">Something went wrong</h1>
          <p className="text-lg text-muted-foreground">
            Try reloading the content or navigate to a different page or refresh the page.
          </p>
        </div>
        <div className="flex gap-4">
          <Button loading={isRetrying} onClick={handleReset}>
            Reload
          </Button>
          <Button loading={isLoading} onClick={handleGoHome}>
            Go home
          </Button>
        </div>
      </div>

      <div className="col-span-2 lg:col-span-1 relative">
        <Image
          src="/img/500-dog.png"
          alt="500 error dog with computer - Image by storyset on Freepik"
          width={668}
          height={668}
          priority
        />
      </div>
    </div>
  );
}
