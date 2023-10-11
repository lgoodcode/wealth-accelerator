import { captureException } from '@sentry/nextjs';

import { supabase } from '@/lib/supabase/client';

export const getTotalWAA = async (userId: string, date: Date) => {
  const { error: waaError, data = 0 } = await supabase.rpc('total_waa_before_date', {
    user_id: userId,
    target_date: date.toUTCString(),
  });

  if (waaError || data === null) {
    const error = waaError || new Error('No data returned');
    console.error(error);
    captureException(error, {
      extra: { date },
    });
    return null;
  }

  return data;
};
