import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { JsonParseApiRequest } from '@/lib/utils/json-parse-api-request';
import { createEmailBody, sendEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase/server/admin';

export const dynamic = 'force-dynamic';
export const POST = ContactRoute;

type ContactBody = {
  fullName: string;
  email: string;
  message: string;
};

type TemplateData = {
  full_name: string;
  email: string;
  message: string;
};

async function ContactRoute(request: Request) {
  const body = await JsonParseApiRequest<ContactBody>(request);

  if (body instanceof Error) {
    return NextResponse.json({ error: body.message }, { status: 400 });
  } else if (!body.fullName) {
    return NextResponse.json({ error: 'Missing fullName' }, { status: 400 });
  } else if (!body.email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  } else if (!body.message) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  const { error: notifiersError, data: notifiers } = await supabaseAdmin
    .from('notifiers')
    .select('name, email')
    .eq('contact_email', true);

  if (notifiersError || !notifiers.length) {
    const error = notifiersError || new Error('No notifiers found');
    captureException(error);
    return NextResponse.json({ error: 'No notifiers found' }, { status: 500 });
  }

  const emailBody = createEmailBody<TemplateData>(notifiers, 'contact', {
    full_name: body.fullName,
    email: body.email,
    message: body.message,
  });

  try {
    const res = await sendEmail(emailBody);

    if (res.data.failed > 0) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    captureException(error, {
      extra: { emailBody },
    });
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
