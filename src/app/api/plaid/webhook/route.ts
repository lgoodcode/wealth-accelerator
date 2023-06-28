import { NextResponse } from 'next/server';
import { captureMessage } from '@sentry/nextjs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: 'Missing body' }, { status: 400 });
  }

  console.log('/api/plaid/webhook POST', body);
  captureMessage('/api/plaid/webhook POST', { extra: body });

  // const { webhook_code, item_id } = body;
  // const { webhook_code } = body;

  // switch (webhook_code) {
  //   case 'DEFAULT_UPDATE':
  //     break;

  //   default:
  //     console.log('unhandled webhook_code', webhook_code);
  // }

  return NextResponse.json({ success: true });
}
