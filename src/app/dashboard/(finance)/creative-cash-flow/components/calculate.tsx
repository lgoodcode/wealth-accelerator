'use client';

import { useAtom, useAtomValue } from 'jotai';
import { toast } from 'react-toastify';
import { Share2 } from 'lucide-react';

import { creativeCashFlowResultAtom, isInputsOpenAtom } from '../atoms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { InputForm } from './input-form';
import type { Transaction } from '@/lib/plaid/types/transactions';

interface ContentProps {
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
}

const handleShare = () => {
  toast.success('An email has been sent to the advisors with the results');
};

export function Calculate({ transactions }: ContentProps) {
  const [isInputsOpen, setIsInputsOpen] = useAtom(isInputsOpenAtom);
  const results = useAtomValue(creativeCashFlowResultAtom);

  return (
    <div className="inline-flex w-full justify-center">
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

      <div className="flex h-14 items-center gap-4 ml-4">
        <Button disabled={!results}>Save</Button>
        <Button disabled={!results} onClick={handleShare}>
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
