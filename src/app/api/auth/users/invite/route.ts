import { NextRequest, NextResponse } from 'next/server';
import { AuthError } from '@supabase/supabase-js';
import { captureException } from '@sentry/nextjs';

import { JsonParseApiRequest } from '@/lib/utils/json-parse-api-request';
import { supabaseAdmin } from '@/lib/supabase/server/admin';
import { getUser } from '@/lib/supabase/server/get-user';
import { initcap } from '@/lib/utils/initcap';
import { Role } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const POST = inviteUser;

async function inviteUser(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } else if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await JsonParseApiRequest<{ name: string; email: string }>(request);

    if (body instanceof Error) {
      return NextResponse.json({ error: body.message }, { status: 400 });
    }

    const { name, email } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    } else if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const { error: emailInUseError, data: emailInUse } = await supabaseAdmin.rpc('is_email_used', {
      email,
    });

    if (emailInUseError) {
      console.error(emailInUseError);
      captureException(emailInUseError, {
        extra: {
          name,
          email,
        },
      });

      return NextResponse.json({ error: emailInUseError.message }, { status: 500 });
    }

    if (emailInUse) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 422 });
    }

    const {
      error: inviteError,
      data: { user: invitedUser },
    } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { name },
      // Need to redirect to the auth callback to exchange the code for the session
      // and then redirect to the reset password page with the session
      // so the user can reset their password
      redirectTo: `${request.nextUrl.origin}/api/auth/callback?redirect_to=/set-password`,
    });

    if (inviteError || !invitedUser) {
      const error = inviteError || new Error('Failed to invite user');

      console.error(error);
      captureException(error, {
        extra: {
          name,
          email,
        },
      });

      return NextResponse.json(
        { error },
        { status: error instanceof AuthError ? error.status : 500 }
      );
    }

    return NextResponse.json({
      user: {
        id: invitedUser.id,
        // Capitalize the name before sending it back because it's from auth.users
        name: initcap(invitedUser.user_metadata.name),
        email: invitedUser.email,
        role: Role.USER,
      },
    });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
