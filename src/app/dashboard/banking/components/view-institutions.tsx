import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface ViewInstitutionsProps {
  institutions: ClientInstitution[];
}

export function ViewInstitutions({ institutions }: ViewInstitutionsProps) {
  return (
    <div>
      <Tabs className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger disabled value="account">
            Account
          </TabsTrigger>
          <TabsTrigger disabled value="transactions">
            Transactions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account</TabsContent>
        <TabsContent value="transactions">Transactions</TabsContent>
      </Tabs>
    </div>
  );
}
