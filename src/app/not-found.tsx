'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-semibold">
        Oops, the page you&apos;re looking for wasn&apos;t found.
      </h1>
      <div className="mt-6 text-lg text-muted-foreground">
        <Button size="lg" className="text-lg" onClick={() => router.push('/dashboard/home')}>
          Go home
        </Button>
      </div>
    </div>
  );
}
