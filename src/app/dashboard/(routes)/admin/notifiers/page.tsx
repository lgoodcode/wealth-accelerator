import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Notifiers } from './components/notifiers';

export const metadata: Metadata = {
  title: 'Notifiers',
};

export default async function NotifiersPage() {
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('notifiers')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Notifiers</h2>
        <p className="text-muted-foreground">
          Manage the people that will be notified for different features.
        </p>
      </div>
      <Separator className="mt-6" />
      <Notifiers notifiersData={data} />
    </div>
  );
}
