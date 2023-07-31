import { captureException } from '@sentry/nextjs';
import { Users, FileText } from 'lucide-react';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { CreateInsurancePolicy } from './components/create-insurance-policy';
import { InsuranceCompany } from '../types';

export const metadata: Metadata = {
  title: 'New Policy | Insurance Policies',
};

export default async function CreatePolicyPage() {
  const supabase = createSupabase();
  const { error: usersError, data: users } = await supabase
    .from('users')
    .select('id, name')
    .order('created_at', { ascending: true });

  if (usersError) {
    console.error(usersError);
    captureException(usersError);
    return <PageError />;
  }

  const { error: companiesError, data: companiesData } = await supabase
    .from('insurance_companies')
    .select('*')
    .order('id', { ascending: true });

  if (companiesError) {
    console.error(companiesError);
    captureException(companiesError);
    return <PageError />;
  }

  const companies = companiesData as unknown as InsuranceCompany[];

  return (
    <div className="p-8">
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Insurance Policies</h2>
          <p className="text-muted-foreground">View, create, and manage user&apos;s policies.</p>
        </div>
        <Breadcrumbs>
          <BreadcrumbItem href="/dashboard/admin/insurance-policies">
            <Users size={16} className="mr-2" />
            Users
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <FileText size={16} className="mr-2" />
            New Policy
          </BreadcrumbItem>
        </Breadcrumbs>
        <Separator />
      </div>
      <div className="flex justify-center">
        <CreateInsurancePolicy users={users} companies={companies} />
      </div>
    </div>
  );
}
