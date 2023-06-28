import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: 'Missing body' }, { status: 400 });
  }

  console.log('/api/plaid/webhook POST', body);

  const { webhook_code, item_id } = body;

  switch (webhook_code) {
    case 'DEFAULT_UPDATE':
      break;

    case 'SYNC_UPDATES_AVAILABLE': {
      console.log('trigger sync');
      break;
    }

    default:
      console.log('unhandled webhook_code', webhook_code);
  }

  return NextResponse.json({ success: true });
}
