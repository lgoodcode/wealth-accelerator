'use client';

import { useAtom } from 'jotai';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { InputForm } from './input-form';
import { isInputsOpenAtom } from '../atoms';
import type { Transaction } from '@/lib/plaid/types/transactions';

interface ContentProps {
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
}

export function Content({ transactions }: ContentProps) {
  const [isInputsOpen, setIsInputsOpen] = useAtom(isInputsOpenAtom);

  return (
    <>
      <div className="flex mt-6 w-full justify-center">
        <div className="w-[640px]">
          <Accordion
            value={isInputsOpen ? 'inputs' : ''}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem value="inputs">
              <AccordionTrigger onClick={() => setIsInputsOpen(!isInputsOpen)}>
                Inputs
              </AccordionTrigger>
              <AccordionContent>
                <InputForm transactions={transactions} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div></div>
    </>
  );
}
