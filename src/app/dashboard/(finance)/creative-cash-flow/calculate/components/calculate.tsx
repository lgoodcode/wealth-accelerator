'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import {
  isInputsOpenAtom,
  creativeCashFlowInputsAtom,
  creativeCashFlowResultAtom,
  resetCreativeCashFlowInputsAtom,
  addCreativeCashFlowRecordAtom,
} from '../../atoms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { InputForm } from './input-form';
import { useSaveRecord } from '../use-save-record';
import type { Transaction } from '@/lib/plaid/types/transactions';

interface ContentProps {
  userId: string;
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
}

export function Calculate({ userId, transactions }: ContentProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isInputsOpen, setIsInputsOpen] = useAtom(isInputsOpenAtom);
  const creativeCashFlowInputs = useAtomValue(creativeCashFlowInputsAtom);
  const [results, setResults] = useAtom(creativeCashFlowResultAtom);
  const resetCreativeCashFlowInput = useSetAtom(resetCreativeCashFlowInputsAtom);
  const addCreativeCashFlowRecord = useSetAtom(addCreativeCashFlowRecordAtom);
  const saveRecord = useSaveRecord();

  const handleSave = async () => {
    if (!results) {
      return;
    }

    setIsSaving(true);

    await saveRecord(userId, creativeCashFlowInputs, results)
      .then((record) => {
        addCreativeCashFlowRecord(record);
        toast.success(
          'The Creative Cash Flow record has been saved and can be shared with the advisors'
        );
        router.refresh(); // Need to refresh so that the records page is updated
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Failed to save the Creative Cash Flow record. Please try again.');
      })
      .finally(() => setIsSaving(false));
  };

  const handleReset = () => {
    setIsInputsOpen(false);
    setResults(null);
    resetCreativeCashFlowInput();
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
              <InputForm transactions={transactions} />
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
