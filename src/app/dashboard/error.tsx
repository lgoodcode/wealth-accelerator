'use client';

import { captureException } from '@sentry/nextjs';

import { DashboardError } from '@/components/dashboard-error';

export default function DashboardInternalErrorPage({ error, reset }: any) {
  captureException(error);

  return <DashboardError reset={reset} />;
}
