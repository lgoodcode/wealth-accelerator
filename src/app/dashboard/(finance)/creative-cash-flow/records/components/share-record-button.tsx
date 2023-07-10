import { useState } from 'react';
import { toast } from 'react-toastify';
import { Share2 } from 'lucide-react';

import { useShareRecord } from '../use-share-record';
import { Button } from '@/components/ui/button';
import type { CreativeCashFlowRecord } from '../../types';

interface ShareRecordButtonProps {
  record: CreativeCashFlowRecord;
}

export function ShareRecordButton({ record }: ShareRecordButtonProps) {
  const shareRecord = useShareRecord();
  const [isSharing, setIsSharing] = useState(false);
  const handleShare = async () => {
    setIsSharing(true);

    await shareRecord(record.inputs.id)
      .then(() => {
        toast.success('An email has been sent to all advisors');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to share record');
      })
      .finally(() => setIsSharing(false));
  };

  return (
    <Button loading={isSharing} onClick={handleShare}>
      <Share2 size={20} className="mr-2" />
      Share to Advisors
    </Button>
  );
}
