'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  isInputsOpenAtom,
  creativeCashFlowInputsAtom,
  creativeCashFlowResultAtom,
  resetCreativeCashFlowInputsAtom,
} from '../../atoms';
import { CcfInputForm } from './ccf-input-form';
import { useSaveRecord } from '../hooks/use-save-record';
import type { Transaction } from '@/lib/plaid/types/transactions';

interface CcfContainerProps {
  user_id: string;
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
  ytd_collections: number;
  default_tax_rate: number;
}

export function CcfContainer({
  user_id,
  transactions,
  ytd_collections,
  default_tax_rate,
}: CcfContainerProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isInputsOpen, setIsInputsOpen] = useAtom(isInputsOpenAtom);
  const [results, setResults] = useAtom(creativeCashFlowResultAtom);
  const creativeCashFlowInputs = useAtomValue(creativeCashFlowInputsAtom);
  const resetCreativeCashFlowInput = useSetAtom(resetCreativeCashFlowInputsAtom);
  const saveRecord = useSaveRecord();

  const handleReset = () => {
    setIsInputsOpen(false);
    setResults(null);
    resetCreativeCashFlowInput();
  };

  const handleSave = async () => {
    if (!results) {
      return;
    }

    setIsSaving(true);

    await saveRecord(user_id, creativeCashFlowInputs, results)
      .then(async () => {
        // Wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(
          'The Creative Cash Flow record has been saved and can be shared with the advisors'
        );
        handleReset();
        router.refresh(); // Need to refresh so that the records page and ytd_collections are updated
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Failed to save the Creative Cash Flow record. Please try again.');
      })
      .finally(() => setIsSaving(false));
  };

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
              <CcfInputForm
                user_id={user_id}
                transactions={transactions}
                ytd_collections={ytd_collections}
                default_tax_rate={default_tax_rate}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex h-14 items-center gap-4 ml-4">
        {results && (
          <>
            <Button disabled={!results} loading={isSaving} onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" disabled={!results} onClick={handleReset}>
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
