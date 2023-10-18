'use client';

import { useState, useCallback } from 'react';
import { UpdateAccountDialog } from './accounts/update-account-dialog';

interface HelpDialogProps {}

export default function HelpDialog({}: HelpDialogProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const handleUpdateDialogOpenChange = useCallback((open?: boolean) => {
    setShowUpdateDialog((prev) => open ?? !prev);
  }, []);

  return (
    <UpdateAccountDialog
      open={showUpdateDialog}
      onOpenChange={handleUpdateDialogOpenChange}
      row={}
    />
  );
}
