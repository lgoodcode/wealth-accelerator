import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { InputForm } from './components/input-form';
import { Content } from './components/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Creative Cash Flow',
};

export default async function CreativeCashFlowPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  // Get all of the users transactions data split
  const supabase = createSupabase();
  const { error, data } = await supabase.rpc('get_transactions_by_user_id', {
    arg_user_id: user.id,
  });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Creative Cash Flow</h2>
        <p className="text-muted-foreground">
          View where your money is going and how much you are saving.
        </p>
      </div>
      <Separator className="mt-6" />
      <>
        <div className="flex mt-6 w-full justify-center">
          <div className="w-[640px]">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Inputs</AccordionTrigger>
                <AccordionContent>
                  <InputForm />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div>
          <Content data={data} />
        </div>
      </>
    </div>
  );
}
