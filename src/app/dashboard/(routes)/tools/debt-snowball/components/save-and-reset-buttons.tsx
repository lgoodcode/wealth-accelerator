import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { useSaveDebtSnowballRecord } from '../hooks/use-save-debt-snowball-record';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { debtCalculationInputsAtom, debtCalculationResultsAtom } from '../atoms';
import type { Debt } from '@/lib/types/debts';

interface SaveAndResetButtonsProps {
  className?: string;
  userId: string;
  debts: Debt[];
  handleReset: () => void;
}

export function SaveAndResetButtons({
  className,
  userId,
  debts,
  handleReset,
}: SaveAndResetButtonsProps) {
  const inputs = useAtomValue(debtCalculationInputsAtom);
  const results = useAtomValue(debtCalculationResultsAtom);
  const saveDebtSnowballRecord = useSaveDebtSnowballRecord();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!inputs || !results) {
      return;
    }

    setIsSaving(true);

    await saveDebtSnowballRecord(userId, debts, inputs, results)
      .then(async () => {
        // Wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('The Debt Snowball record has been saved');
        // toast.success(
        //   'The Debt Snowball record has been saved and can be shared with the advisors'
        // );
        handleReset();
      })
      .catch((error) => {
        console.error(error, {
          inputs,
          results,
        });
        captureException(error, {
          extra: {
            inputs,
            results,
          },
        });
        toast.error('Failed to save the Debt Snowball record. Please try again.');
      })
      .finally(() => setIsSaving(false));
  };

  if (!results) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-4 ml-4', className)}>
      <Button
        className="flex"
        size="sm"
        disabled={!results}
        loading={isSaving}
        onClick={handleSave}
      >
        Save
      </Button>
      <Button size="sm" variant="outline" disabled={!results} onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
