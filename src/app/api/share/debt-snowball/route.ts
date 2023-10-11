import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { JsonParseApiRequest } from '@/lib/utils/json-parse-api-request';
import { createEmailBody, sendEmail } from '@/lib/email';
import { getUser } from '@/lib/supabase/server/get-user';
import { supabaseAdmin } from '@/lib/supabase/server/admin';

export const dynamic = 'force-dynamic';
export const POST = ShareDebtSnowballRecord;
const TEMPLATE_ID = 'share_debt_snowball';

type TemplateData = {
  name: string;
  record_id: string;
};

async function ShareDebtSnowballRecord(request: Request) {
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
    .eq('debt_snowball', true);

  if (notifiersError || !notifiers.length) {
    const error = notifiersError || new Error('No notifiers found');
    captureException(error);
    return NextResponse.json({ error: 'No notifiers found' }, { status: 500 });
  }

  const emailBody = createEmailBody<TemplateData>(notifiers, TEMPLATE_ID, {
    name: user.name,
    record_id: body.record_id,
  });

  try {
    const res = await sendEmail(emailBody);

    if (res.data.failed > 0) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error, { emailBody });
    captureException(error, {
      extra: {
        emailBody,
      },
    });
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
