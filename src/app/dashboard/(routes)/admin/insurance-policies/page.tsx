import { captureException } from '@sentry/nextjs';
import { Users } from 'lucide-react';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { UsersInsurance } from './components/users-insurance';

export const metadata: Metadata = {
  title: 'Insurance Policies',
};

export default async function InsurancePolicies() {
  const supabase = createSupabase();
  // const { error, data } = await supabase
  //   .from('users')
  //   .select('*')
  //   .order('created_at', { ascending: true });

  // if (error) {
  //   console.error(error);
  //   captureException(error);
  //   return <PageError />;
  // }

  return (
    <div className="p-8">
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Insurance Policies</h2>
          <p className="text-muted-foreground">View, create, and manage user&apos;s policies.</p>
        </div>
        <Breadcrumbs>
          <BreadcrumbItem>
            <Users size={16} className="mr-2" />
            Users
          </BreadcrumbItem>
        </Breadcrumbs>
        <Separator />
      </div>
      <div className="flex justify-center">
        <UsersInsurance />
      </div>
    </div>
  );
}
