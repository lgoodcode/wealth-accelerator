import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { SaveCreativeCashFlowDialog } from './save-creative-cash-flow-dialog';
import { creativeCashFlowInputsAtom, creativeCashFlowResultAtom } from '../atoms';
import { useSaveCcfRecord } from '../hooks/use-save-ccf-record';

interface SaveAndResetButtonsProps {
  className?: string;
  user_id: string;
  handleReset: () => void;
}

export function SaveAndResetButtons({ className, user_id, handleReset }: SaveAndResetButtonsProps) {
  const router = useRouter();
  const inputs = useAtomValue(creativeCashFlowInputsAtom);
  const results = useAtomValue(creativeCashFlowResultAtom);
  const saveCcfRecord = useSaveCcfRecord();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSaveDialogOpenChange = useCallback((open?: boolean) => {
    setShowSaveDialog((prev) => open ?? !prev);
  }, []);

  const handleSave = async (name: string) => {
    if (!inputs || !results) {
      return;
    }

    await saveCcfRecord(user_id, name, inputs, results)
      .then(async () => {
        // Wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(
          'The Creative Cash Flow record has been saved and can be shared with the advisors'
        );
        handleReset();
        setShowSaveDialog(false);
        router.refresh(); // Need to refresh so that the records page and ytd_collections are updated
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
        toast.error('Failed to save the Creative Cash Flow record. Please try again.');
      });
  };

  if (!inputs || !results) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-4 ml-4', className)}>
      <Button size="sm" disabled={!results} onClick={() => setShowSaveDialog(true)}>
        Save
      </Button>
      <Button size="sm" variant="outline" disabled={!results} onClick={handleReset}>
        Reset
      </Button>

      <SaveCreativeCashFlowDialog
        open={showSaveDialog}
        onOpenChange={handleSaveDialogOpenChange}
        handleSave={handleSave}
      />
    </div>
  );
}
