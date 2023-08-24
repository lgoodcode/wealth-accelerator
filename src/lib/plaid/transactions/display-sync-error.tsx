import { toast } from 'react-toastify';

import { Toast } from '@/components/ui/toast';
import type { SyncTransactionsResponseError } from '@/lib/plaid/types/sync';

export const displaySyncError = (
  syncError: SyncTransactionsResponseError,
  institutionName: string
) => {
  if (syncError.plaid?.isCredentialError) {
    toast.error(
      <Toast title="Syncing transactions">
        Credentials need to be updated for <span className="font-bold">{institutionName}</span>
      </Toast>
    );
  } else if (syncError.general) {
    toast.error(
      <Toast title="Syncing transactions">
        Failed to begin transactions sync for <span className="font-bold">{institutionName}</span>
      </Toast>
    );
  } else {
    toast.error(
      <Toast title="Syncing transactions">
        Failed to sync transactions for <span className="font-bold">{institutionName}</span>
      </Toast>
    );
  }
};
