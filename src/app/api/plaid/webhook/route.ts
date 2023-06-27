import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('/api/plaid/webhook POST');

  return NextResponse.json({
    error: null,
    data: 'OK',
  });
}
