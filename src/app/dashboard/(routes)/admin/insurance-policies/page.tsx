import { captureException } from '@sentry/nextjs';
import { Users } from 'lucide-react';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { UsersInsurancePolicies } from './components/users-insurance-policies';
import type { UserInsurancePolicyView } from './types';

export const metadata: Metadata = {
  title: 'Insurance Policies',
};

export default async function InsurancePoliciesPage() {
  const supabase = createSupabase();
  const data = {};
  // const { error, data } = await supabase.rpc('get_all_user_insurance_policy_views');

  // if (error) {
  //   console.error(error);
  //   captureException(error);
  //   return <PageError />;
  // }

  const userInsurancePolicyViews = data as unknown as UserInsurancePolicyView[];

  return (
    <div className="p-8">
      <div className="space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Insurance Policies</h2>
          <p className="text-muted-foreground">View, create, and manage user&apos;s policies.</p>
        </div>
        <Breadcrumbs>
          <BreadcrumbItem active>
            <Users size={16} className="mr-2" />
            Users
          </BreadcrumbItem>
        </Breadcrumbs>
        <Separator />
      </div>
      <div className="flex justify-center">
        <UsersInsurancePolicies data={userInsurancePolicyViews} />
      </div>
    </div>
  );
}
