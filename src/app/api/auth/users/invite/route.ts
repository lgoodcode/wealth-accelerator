import { NextResponse } from 'next/server';
import { AuthError } from '@supabase/supabase-js';
import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/api';

export const dynamic = 'force-dynamic';
export const POST = inviteUser;

async function inviteUser(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body as { name: string; email: string };

    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    } else if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const url = new URL(request.url);
    const supabase = createSupabase();
    const {
      error: inviteError,
      data: { user: invitedUser },
    } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { name },
      // Need to redirect to the auth callback to exchange the code for the session
      // and then redirect to the reset password page with the session
      // so the user can reset their password
      redirectTo: `${url.origin}/api/auth/callback?redirect_to=/set-password`,
    });

    if (inviteError || !invitedUser) {
      const error = inviteError || new Error('Failed to invite user');

      console.error(error);
      captureException(error);
      return NextResponse.json(
        {
          error: error instanceof AuthError ? error : 'Failed to invite user',
        },
        { status: error instanceof AuthError ? error.status : 500 }
      );
    }

    // Get the user in the database
    const { error: userError, data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', invitedUser.id)
      .single();

    if (userError || !user) {
      const error = userError || new Error('Failed to get user');

      console.error(error);
      captureException(error);
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
