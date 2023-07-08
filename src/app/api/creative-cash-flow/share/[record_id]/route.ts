import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/getUser';
import { createSupabase } from '@/lib/supabase/server/createSupabase';
import type { Notifier } from '@/app/dashboard/(admin)/creative-cash-flow-notifications/types';

export const GET = ShareCreativeCashFlowRecord;

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

const SMTP2GO_URL = 'https://api.smtp2go.com/v3/email/send';
const EMAIL_SENDER = 'ChiroWealth <noreply@mail.chirowealth.com>';
const CCF_RECORD_TEMPLATE = 'share_ccf_record';

const createEmailBody = (record_id: string, sharerName: string, notifiers: NotifierToSend[]) => {
  return JSON.stringify({
    api_key: process.env.SMPT2GO_API_KEY,
    to: notifiers.map((notifier) => `${notifier.name} <${notifier.email}>`),
    sender: EMAIL_SENDER,
    template_id: CCF_RECORD_TEMPLATE,
    template_data: {
      name: sharerName,
      record_id: record_id,
    },
  });
};

const sendEmail = async (
  record_id: string,
  sharerName: string,
  notifiers: NotifierToSend[]
): Promise<SMTP2GoResponseSuccess> => {
  const response = await fetch(SMTP2GO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: createEmailBody(record_id, sharerName, notifiers),
  });

  const res = (await response.json()) as SMTP2GoResponse;

  if ('error' in res.data) {
    throw new Error(res.data.error);
  } else {
    return res as SMTP2GoResponseSuccess;
  }
};

interface ShareCreativeCashFlowRecordParams {
  params: {
    record_id: string;
  };
}

async function ShareCreativeCashFlowRecord(
  _: Request,
  { params: { record_id } }: ShareCreativeCashFlowRecordParams
) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user' }, { status: 400 });
  }

  const supabase = createSupabase(true);
  const { error: notifiersError, data } = await supabase
    .from('creative_cash_flow_notifiers')
    .select('name, email')
    .eq('enabled', true);

  if (notifiersError || !data) {
    const error = notifiersError || new Error('No notifiers found');
    captureException(error);
    return NextResponse.json({ error: 'No notifiers found' }, { status: 500 });
  }

  try {
    await sendEmail(record_id, user.name, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
