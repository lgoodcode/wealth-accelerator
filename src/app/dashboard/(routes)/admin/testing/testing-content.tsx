'use client';

import { captureException, type SeverityLevel } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const getError = async () => {
  try {
    const res = await fetch('/api/test/error');
    const data = await res.text();
    console.error(data);
    toast.success(
      <div className="flex flex-col gap-4">
        <span>Error created on server:</span>
        <pre>{data}</pre>
      </div>
    );
  } catch (error: any) {
    console.error(error);
    toast.error('Failed to create error on server');
  }
};

const createError = (level?: SeverityLevel | undefined) => {
  try {
    throw new Error('Test Error');
  } catch (error: any) {
    console.error(error);
    captureException(error, { level });
    toast.success(
      <div className="flex flex-col gap-4">
        <span>Error created on client:</span>
        <pre>{JSON.stringify(error.message)}</pre>
      </div>
    );
  }
};

export function TestingContent() {
  return (
    <Card>
      <CardContent className="space-y-8">
        <h3 className="text-xl font-semibold">Errors</h3>
        <div className="flex flex-row justify-between gap-8 items-center">
          <span>Server</span>
          <Button variant="destructive" onClick={getError}>
            Generate
          </Button>
        </div>
        <div className="flex flex-row justify-between gap-8 items-center">
          <span>Client</span>
          <Button variant="destructive" onClick={() => createError()}>
            Error
          </Button>
          <Button variant="secondary" onClick={() => createError('info')}>
            Info
          </Button>
          <Button variant="secondary" onClick={() => createError('log')}>
            Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
