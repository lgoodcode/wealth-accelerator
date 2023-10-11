import { toast } from 'react-toastify';
import { Share2 } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useShareSnowballRecord } from '../../hooks/use-share-snowball-record';
import type { DebtSnowballRecord } from '../../types';

interface ShareSnowballRecordMenuItemProps {
  record: DebtSnowballRecord;
}

export function ShareSnowballRecordMenuItem({ record }: ShareSnowballRecordMenuItemProps) {
  const shareRecord = useShareSnowballRecord();
  const handleShare = async () => {
    await shareRecord(record.id)
      .then(() => {
        toast.success('An email has been sent to all advisors');
      })
      .catch((error) => {
        if (error.message === 'No notifiers found') {
          toast.error('No advisors have been set up to receive emails');
          return;
        }

        console.error(error);
        toast.error('Failed to share record');
      });
  };

  return (
    <DropdownMenuItem onClick={handleShare}>
      <Share2 className="mr-2 h-4 w-4 text-muted-foreground/70" />
      Share
    </DropdownMenuItem>
  );
}
