import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DebtSnowballInputsContainer } from './debt-snowball-inputs-container';
import type { Debt } from '@/lib/types/debts';

enum TabsValue {
  Inputs = 'inputs',
  Results = 'results',
}

interface DebtSnowballProps {
  debts: Debt[];
}

export function DebtSnowball({ debts }: DebtSnowballProps) {
  return (
    <Tabs className="w-full" defaultValue={TabsValue.Inputs}>
      <TabsList className="grid w-[400px] mx-auto grid-cols-2 mb-8">
        <TabsTrigger value={TabsValue.Inputs}>Inputs</TabsTrigger>
        <TabsTrigger value={TabsValue.Results}>Results</TabsTrigger>
      </TabsList>
      <TabsContent value={TabsValue.Inputs}>
        <DebtSnowballInputsContainer debts={debts} />
      </TabsContent>
      <TabsContent value={TabsValue.Results}>content</TabsContent>
    </Tabs>
  );
}
