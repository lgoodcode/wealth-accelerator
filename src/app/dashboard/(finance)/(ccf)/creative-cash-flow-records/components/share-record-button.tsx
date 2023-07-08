import { useState } from 'react';
import { toast } from 'react-toastify';
import { Share2 } from 'lucide-react';

import { fetcher } from '@/lib/utils/fetcher';
import { Button } from '@/components/ui/button';
import type { CreativeCashFlowRecord } from '../../types';

const shareRecord = async (record_id: string) => {
  const { error } = await fetcher(`/api/creative-cash-flow/share/${record_id}`);

  if (error && error.message !== 'No notifiers found') {
    throw error;
  }
};

interface ShareRecordButtonProps {
  record: CreativeCashFlowRecord;
}

export function ShareRecordButton({ record }: ShareRecordButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const handleShare = () => {
    setIsSharing(true);

    shareRecord(record.inputs.id)
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
