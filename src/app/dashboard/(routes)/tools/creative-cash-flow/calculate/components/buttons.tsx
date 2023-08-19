import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { creativeCashFlowInputsAtom, creativeCashFlowResultAtom } from '../../atoms';
import { useSaveRecord } from '../hooks/use-save-record';

interface ButtonsProps {
  className?: string;
  user_id: string;
  handleReset: () => void;
}

export function Buttons({ className, user_id, handleReset }: ButtonsProps) {
  const router = useRouter();
  const saveRecord = useSaveRecord();
  const [isSaving, setIsSaving] = useState(false);
  const inputs = useAtomValue(creativeCashFlowInputsAtom);
  const results = useAtomValue(creativeCashFlowResultAtom);

  const handleSave = async () => {
    if (!results) {
      return;
    }

    setIsSaving(true);

    await saveRecord(user_id, inputs, results)
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
        captureException(error, {
          extra: {
            inputs,
            results,
          },
        });
        toast.error('Failed to save the Creative Cash Flow record. Please try again.');
      })
      .finally(() => setIsSaving(false));
  };

  if (!results) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-4 ml-4', className)}>
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
  );
}
