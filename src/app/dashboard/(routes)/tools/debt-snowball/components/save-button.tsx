import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { debtCalculationInputsAtom, debtCalculationResultsAtom } from '../atoms';
// import { useSaveRecord } from '../hooks/use-save-record';

interface SaveButtonsProps {
  className?: string;
  userId: string;
}

export function SaveButton({ className, userId }: SaveButtonsProps) {
  const router = useRouter();
  // const saveRecord = useSaveRecord();
  const [isSaving, setIsSaving] = useState(false);
  const inputs = useAtomValue(debtCalculationInputsAtom);
  const results = useAtomValue(debtCalculationResultsAtom);

  const handleSave = async () => {
    if (!results) {
      return;
    }

    setIsSaving(true);

    // await saveRecord(userId, inputs, results)
    //   .then(async () => {
    //     // Wait 1 second
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //     toast.success(
    //       'The Creative Cash Flow record has been saved and can be shared with the advisors'
    //     );
    //     router.refresh(); // Need to refresh so that the records page and ytd_collections are updated
    //   })
    //   .catch((error) => {
    //     console.error(error, {
    //       inputs,
    //       results,
    //     });
    //     captureException(error, {
    //       extra: {
    //         inputs,
    //         results,
    //       },
    //     });
    //     toast.error('Failed to save the Creative Cash Flow record. Please try again.');
    //   })
    //   .finally(() => setIsSaving(false));
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
    </div>
  );
}
