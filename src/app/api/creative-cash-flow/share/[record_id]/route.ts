import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/getUser';

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

type EmailBody = {
  record_id: string;
  name: string;
  email: string;
};

const EMAIL_SENDER = 'ChiroWealth <noreplay@mail.chirowealth.com>';
const CCF_RECORD_TEMPLATE = 'share_ccf_record';

const createEmailBody = (body: EmailBody) => {
  return JSON.stringify({
    api_key: process.env.SMPT2GO_API_KEY,
    to: [`${body.name} <${body.email}>`],
    sender: EMAIL_SENDER,
    template_id: CCF_RECORD_TEMPLATE,
    template_data: {
      user: body.name,
      record_id: body.record_id,
    },
  });
};

const sendEmail = async (body: EmailBody): Promise<SMTP2GoResponseSuccess> => {
  console.log('sendEmail', createEmailBody(body));
  const response = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: createEmailBody(body),
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
  req: Request,
  { params: { record_id } }: ShareCreativeCashFlowRecordParams
) {
  // const user = await getUser();

  // if (!user) {
  //   return NextResponse.json({ error: 'No user found' }, { status: 401 });
  // }

  try {
    const response = await sendEmail({
      record_id,
      // name: user.name,
      // email: user.email,
      name: 'name',
      email: 'email',
    });

    if (response.data) console.log(response);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
