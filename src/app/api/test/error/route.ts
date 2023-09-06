import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

export const dynamic = 'force-dynamic';
export const GET = async () => {
  try {
    throw new Error('Test error');
  } catch (error: any) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
