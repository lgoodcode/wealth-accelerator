'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { captureException } from '@sentry/nextjs';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: any) {
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-semibold">Oops, an error occured.</h1>
      <div className="mt-6 flex gap-4">
        <Button loading={isRetrying} onClick={handleReset}>
          Reload
        </Button>
        <Button loading={isLoading} onClick={handleGoHome}>
          Go home
        </Button>
      </div>
    </div>
  );
}
