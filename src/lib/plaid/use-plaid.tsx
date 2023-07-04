import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {
  usePlaidLink,
  type PlaidLinkOptions,
  type PlaidLinkOnEvent,
  type PlaidLinkOnExit,
  type PlaidLinkOnSuccess,
} from 'react-plaid-link';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { createLinkToken } from '@/lib/plaid/create-link-token';
import { exchangeLinkToken } from '@/lib/plaid/exchange-link-token';
import { clientSyncTransactions } from '@/lib/plaid/transactions/clientSyncTransactions';
import { handleClientSyncTransactionsError } from '@/lib/plaid/transactions/handleClientSyncTransactionsError';
import { updateModeAtom, isInsItemIdSyncingOrLoadingAtom } from '@/lib/atoms/institutions';
import { Toast } from '@/components/ui/toast';

export const usePlaid = () => {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isGettingLinkToken, setIsGettingLinkToken] = useState(false);
  const [updateMode, setUpdateMode] = useAtom(updateModeAtom);
  const setIsInsItemIdSyncingOrLoading = useSetAtom(isInsItemIdSyncingOrLoadingAtom);

  // On successful link, exchange the public token for an access token
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      const { error: tokenError, data } = await exchangeLinkToken({ public_token, metadata });
      const institutionName = metadata.institution?.name ?? 'Unknown institution';

      if (tokenError || !data) {
        console.error(tokenError);
        toast.error(
          <Toast title="Syncing transactions">
            Failed to connect <span className="font-bold">{institutionName}</span>
          </Toast>
        );
        return;
      }

      toast(
        <Toast title="Connected institution">
          Connected <span className="font-bold">{institutionName}</span>
        </Toast>
      );

      router.refresh();
      setIsInsItemIdSyncingOrLoading(data.item_id);

      const syncError = await clientSyncTransactions(data.item_id);

      if (syncError) {
        handleClientSyncTransactionsError(
          syncError,
          metadata.institution?.name ?? 'Unknown institution'
        );

        if (syncError.plaid?.isCredentialError) {
          setUpdateMode(true);
        }
      } else {
        toast(
          <Toast title="Syncing transactions">
            <div className="flex flex-col space-y-3">
              <span>
                Transactions are now being synced for{' '}
                <span className="font-bold">
                  {<span className="font-bold">{institutionName}</span>}
                </span>
                . The last 30 days of transactions are available to be viewed while the rest are
                being retrieved.
              </span>
              <span className="font-extrabold">NOTE: This may take a few minutes.</span>
            </div>
          </Toast>
        );
      }

      setIsInsItemIdSyncingOrLoading(null);
    },
    [router, setIsInsItemIdSyncingOrLoading, setUpdateMode]
  );

  const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
    // log onEvent callbacks from Link
    // https://plaid.com/docs/link/web/#onevent
    if (metadata.view_name === 'ERROR') {
      console.error('Plaid Link Error', metadata);
      captureException(new Error('Plaid Link Error'), {
        extra: { metadata },
      });
    } else {
      console.log('onEvent', { eventName, metadata });
    }
  }, []);

  const onExit = useCallback<PlaidLinkOnExit>(
    (error, metadata) => {
      // log onExit callbacks from Link, handle errors
      // https://plaid.com/docs/link/web/#onexit
      console.warn(error, metadata);
      // Reset the link token if it was in update mode so it can't be used again
      // and reset the selection if the user wants to add a new institution
      // or click a different institution
      if (updateMode && metadata.status === 'requires_credentials') {
        setUpdateMode(false);
        setLinkToken(null);
      }
    },
    [setUpdateMode, updateMode]
  );

  const plaidConfig: PlaidLinkOptions = useMemo(
    () => ({
      token: linkToken,
      onSuccess,
      onEvent,
      onExit,
    }),
    [linkToken, onSuccess, onEvent, onExit]
  );

  const { open, ready } = usePlaidLink(plaidConfig);

  // Launches update mode
  useEffect(() => {
    if (updateMode && linkToken && open) {
      open();
    }
  }, [updateMode, linkToken, open]);

  // Get the link token
  useEffect(() => {
    if (!linkToken) {
      setIsGettingLinkToken(true);

      createLinkToken()
        .then(setLinkToken)
        .catch((error) => {
          console.error(error);
          toast.error('Failed to create link token');
        })
        .finally(() => setIsGettingLinkToken(false));
    }
  }, [linkToken]);

  return {
    open,
    ready,
    isGettingLinkToken,
  };
};
