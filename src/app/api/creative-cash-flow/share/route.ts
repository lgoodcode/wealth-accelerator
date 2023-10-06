import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { JsonParseApiRequest } from '@/lib/utils/json-parse-api-request';
import { getUser } from '@/lib/supabase/server/get-user';
import { supabaseAdmin } from '@/lib/supabase/server/admin';
import type { Notifier } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const POST = ShareCreativeCashFlowRecord;

type SMTP2GoResponseError = {
  request_id: string;
  data: {
    error: string;
    error_code: string;
  };
};

type SMTP2GoResponseSuccess = {
  request_id: string;
  data: {
    succeeded: number;
    failed: number;
  };
};

type SMTP2GoResponse = SMTP2GoResponseError | SMTP2GoResponseSuccess;

type NotifierToSend = Pick<Notifier, 'name' | 'email'>;

const SMTP2GO_URL = process.env.SMTP2GO_API_URL;
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const CCF_RECORD_TEMPLATE = process.env.CCF_RECORD_TEMPLATE;

const createEmailBody = (record_id: string, sharerName: string, notifiers: NotifierToSend[]) => {
  return JSON.stringify({
    api_key: process.env.SMTP2GO_API_KEY,
    to: notifiers.map((notifier) => `${notifier.name} <${notifier.email}>`),
    sender: EMAIL_SENDER,
    template_id: CCF_RECORD_TEMPLATE,
    template_data: {
      name: sharerName,
      record_id: record_id,
    },
  });
};

const sendEmail = async (emailBody: string): Promise<SMTP2GoResponseSuccess> => {
  const response = await fetch(SMTP2GO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: emailBody,
  });

  const res = (await response.json()) as SMTP2GoResponse;

  if ('error' in res.data) {
    throw new Error(res.data.error);
  } else {
    return res as SMTP2GoResponseSuccess;
  }
};

async function ShareCreativeCashFlowRecord(request: Request) {
  const body = await JsonParseApiRequest<{ record_id: string }>(request);

  if (body instanceof Error) {
    return NextResponse.json({ error: body.message }, { status: 400 });
  } else if (!body.record_id) {
    return NextResponse.json({ error: 'Missing record_id' }, { status: 400 });
  }

  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user' }, { status: 400 });
  }

  const { error: notifiersError, data: notifiers } = await supabaseAdmin
    .from('notifiers')
    .select('name, email')
    .eq('creative_cash_flow', true);

  if (notifiersError || !notifiers.length) {
    const error = notifiersError || new Error('No notifiers found');
    captureException(error);
    return NextResponse.json({ error: 'No notifiers found' }, { status: 500 });
  }

  const emailBody = createEmailBody(body.record_id, user.name, notifiers);
  try {
    await sendEmail(emailBody);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error, {
      emailBody: JSON.parse(emailBody),
    });
    captureException(error, {
      extra: {
        emailBody,
      },
    });
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
