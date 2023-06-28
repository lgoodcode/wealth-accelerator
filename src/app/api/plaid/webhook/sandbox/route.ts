import { NextResponse } from 'next/server';

import { plaidClient } from '@/lib/plaid/config';
import {
  SandboxItemFireWebhookRequestWebhookCodeEnum,
  type SandboxItemFireWebhookRequest,
} from 'plaid';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const webhook = url.searchParams.get('webhook') || 'DEFAULT_UPDATE';
  const access_token = url.searchParams.get('access_token');

  if (!access_token) {
    return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
  }

  const request: SandboxItemFireWebhookRequest = {
    access_token,
    webhook_code: webhook as SandboxItemFireWebhookRequestWebhookCodeEnum,
  };

  try {
    const response = await plaidClient.sandboxItemFireWebhook(request);
    console.log('/api/plaid/webhook/sandbox GET', response.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
