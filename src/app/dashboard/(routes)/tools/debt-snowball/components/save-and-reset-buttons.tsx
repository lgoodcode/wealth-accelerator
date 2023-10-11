import { useState, useCallback } from 'react';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { cn } from '@/lib/utils/cn';
import { useSaveSnowballRecord } from '../hooks/use-save-snowball-record';
import { Button } from '@/components/ui/button';
import { SaveDebtSnowballDialog } from './save-debt-snowball-dialog';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculationInputs, DebtCalculationResults } from '../types';

interface SaveAndResetButtonsProps {
  className?: string;
  userId: string;
  debts: Debt[];
  inputs: DebtCalculationInputs | null;
  results: DebtCalculationResults | null;
  handleReset: () => void;
}

export function SaveAndResetButtons({
  className,
  userId,
  debts,
  inputs,
  results,
  handleReset,
}: SaveAndResetButtonsProps) {
  const saveDebtSnowballRecord = useSaveSnowballRecord();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSaveDialogOpenChange = useCallback((open?: boolean) => {
    setShowSaveDialog((prev) => open ?? !prev);
  }, []);

  const handleSave = async (name: string) => {
    if (!inputs || !results) {
      return;
    }

    await saveDebtSnowballRecord(userId, name, debts, inputs, results)
      .then(async () => {
        // Wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('The Debt Snowball record has been saved');
        // TODO: implement sharing debt snowball records
        // toast.success(
        //   'The Debt Snowball record has been saved and can be shared with the advisors'
        // );
        handleReset();
        setShowSaveDialog(false);
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
      });
  };

  if (!inputs || !results) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-4 ml-4', className)}>
      <Button
        className="flex"
        size="sm"
        disabled={!results}
        onClick={() => setShowSaveDialog(true)}
      >
        Save
      </Button>
      <Button size="sm" variant="outline" disabled={!results} onClick={handleReset}>
        Reset
      </Button>

      <SaveDebtSnowballDialog
        open={showSaveDialog}
        onOpenChange={handleSaveDialogOpenChange}
        handleSave={handleSave}
      />
    </div>
  );
}
