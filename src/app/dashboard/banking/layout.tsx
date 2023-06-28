import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Institutions } from './components/institutions';

export const metadata: Metadata = {
  title: 'Banking',
};

interface BankingLayoutProps {
  children: React.ReactNode;
}

export default async function BankingLayout({ children }: BankingLayoutProps) {
  const supabase = createSupabase();
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  // Get all institutions for the user
  const { error, data } = await supabase.from('plaid').select('*').eq('user_id', user.id);
  const institutionData = data || [];

  if (error) {
    console.error(error);
    captureException(error);
  }

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Banking</h2>
        <p className="text-muted-foreground">
          Manage institutions and view transactions for your bank accounts.
        </p>
      </div>
      <Separator className="mt-6" />
      <div className="flex flex-col space-y-4">
        <Institutions institutions={institutionData} />
        <div className="flex-1">{error ? <PageError /> : children}</div>
      </div>
    </div>
  );
}
