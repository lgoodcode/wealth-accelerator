import { useState } from 'react';
import { Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { CreativeCashFlowRecord } from '../../types';

interface ShareRecordButtonProps {
  record: CreativeCashFlowRecord;
}

export function ShareRecordButton({ record }: ShareRecordButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  return (
    <Button loading={isSharing}>
      <Share2 size={20} className="mr-2" />
      Share to Advisors
    </Button>
  );
}
