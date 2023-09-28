'use client';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-semibold">
        Oops, the page you&apos;re looking for wasn&apos;t found.
      </h1>
      <div className="mt-6 flex gap-4">
        <Button asChild size="lg">
          <a href="/dashboard/home">Go home</a>
        </Button>
      </div>
    </div>
  );
}
