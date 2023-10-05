import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { JsonParseApiRequest } from '@/lib/utils/json-parse-api-request';
import { createEmailBody, sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const POST = ContactRoute;

type ContactBody = {
  full_name: string;
  email: string;
  message: string;
};

// TODO: append a column "contact" for the notifiers table and use them here
const NOTIFIERS = [
  {
    name: 'Lawrence Good',
    email: 'lawrence@chirowealth.com',
  },
  // {
  //   name: 'Win Udomlarp',
  //   email: 'win@chirowealth.com',
  // },
];

async function ContactRoute(request: Request) {
  const body = await JsonParseApiRequest<ContactBody>(request);

  if (body instanceof Error) {
    return NextResponse.json({ error: body.message }, { status: 400 });
  } else if (!body.full_name) {
    return NextResponse.json({ error: 'Missing full name' }, { status: 400 });
  } else if (!body.email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  } else if (!body.message) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  // TODO: get the notifiers from the database

  const emailBody = createEmailBody(NOTIFIERS, 'contact', {
    full_name: body.full_name,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
