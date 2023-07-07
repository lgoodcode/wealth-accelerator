'use client';

import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'react-toastify';

import {
  isInputsOpenAtom,
  creativeCashFlowInputsAtom,
  creativeCashFlowResultAtom,
  resetCreativeCashFlowInputsAtom,
} from '../atoms';
import { supabase } from '@/lib/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { InputForm } from './input-form';
import type { Transaction } from '@/lib/plaid/types/transactions';
import type { CreativeCashFlowManagementInputs, CreativeCashFlowManagementResult } from '../types';
import { captureException } from '@sentry/nextjs';

interface ContentProps {
  userId: string;
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
}

const saveRecord = async (
  user_id: string,
  inputs: CreativeCashFlowManagementInputs,
  results: CreativeCashFlowManagementResult
) => {
  const { error: inputsError } = await supabase
    .from('creative_cash_flow_inputs')
    .insert({
      user_id,
      ...inputs,
      start_date: inputs.start_date!.toUTCString(),
      end_date: inputs.end_date!.toUTCString(),
    })
    .eq('user_id', user_id);

  if (inputsError) {
    throw inputsError;
  }

  const { error: resultsError } = await supabase
    .from('creative_cash_flow_results')
    .insert({
      user_id,
      ...results,
    })
    .eq('user_id', user_id);

  if (resultsError) {
    throw resultsError;
  }
};

export function Calculate({ userId, transactions }: ContentProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isInputsOpen, setIsInputsOpen] = useAtom(isInputsOpenAtom);
  const creativeCashFlowInputs = useAtomValue(creativeCashFlowInputsAtom);
  const [results, setResults] = useAtom(creativeCashFlowResultAtom);
  const resetCreativeCashFlowInput = useSetAtom(resetCreativeCashFlowInputsAtom);

  const handleSave = () => {
    if (!results) {
      return;
    }

    setIsSaving(true);

    saveRecord(userId, creativeCashFlowInputs, results)
      .then(() => {
        toast.success(
          'The Creative Cash Flow record has been saved and can be shared with the advisors'
        );
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
