import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSetAtom } from 'jotai';
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
import { syncTransactions } from '@/lib/plaid/transactions/syncTransactions';
import { PlaidCredentialErrorCode } from '@/lib/plaid/types/sync';
import { isInsItemIdSyncingOrLoadingAtom } from '@/lib/atoms/institutions';
import { Toast } from '@/components/ui/toast';

export const usePlaid = () => {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [isGettingLinkToken, setIsGettingLinkToken] = useState(false);
  const isInsItemIdSyncingOrLoading = useSetAtom(isInsItemIdSyncingOrLoadingAtom);

  // On successful link, exchange the public token for an access token
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      try {
        const { item_id } = await exchangeLinkToken({ public_token, metadata });
        // Need to refresh the page to get the new data
        router.refresh();
        isInsItemIdSyncingOrLoading(item_id);

        toast
          .promise(syncTransactions(item_id), {
            pending: {
              render() {
                return (
                  <Toast title="Syncing transactions">
                    Successfully connected{' '}
                    <span className="font-bold">
                      {metadata?.institution?.name ?? 'Unknown institution'}
                    </span>
                    . Please wait and do not leave the page while all your transactions for are
                    being synced.
                  </Toast>
                );
              },
            },
            error: {
              render() {
                return (
                  <Toast title="Syncing transactions">
                    Failed to sync transactions for{' '}
                    <span className="font-bold">
                      {metadata?.institution?.name ?? 'Unknown institution'}
                    </span>
                  </Toast>
                );
              },
            },
            success: {
              render({ data: error }) {
                if (error instanceof Error) {
                  console.error(error);
                  captureException(error);
                  return (
                    <Toast title="Syncing transactions">
                      Failed to sync transactions for{' '}
                      <span className="font-bold">
                        {metadata?.institution?.name ?? 'Unknown institution'}
                      </span>
                    </Toast>
                  );
                } // If the user is required to update their credentials, set update mode
                else if (error === PlaidCredentialErrorCode) {
                  setUpdateMode(true);
                  return (
                    <Toast title="Syncing transactions">
                      Credentials need to be updated for{' '}
                      <span className="font-bold">
                        {metadata?.institution?.name ?? 'Unknown institution'}
                      </span>
                    </Toast>
                  );
                }
                // If there is no error, then the sync was successful
                return (
                  <Toast title="Syncing transactions">
                    All transactions for{' '}
                    <span className="font-bold">
                      {metadata?.institution?.name ?? 'Unknown institution'}
                    </span>{' '}
                    have been synced
                  </Toast>
                );
              },
            },
          })
          .finally(() => isInsItemIdSyncingOrLoading(null));
      } catch (error) {
        console.error(error);
        toast.error('Failed to exchange link token');
      }
    },
    [router, isInsItemIdSyncingOrLoading]
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

  const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
    // log onExit callbacks from Link, handle errors
    // https://plaid.com/docs/link/web/#onexit
    console.warn(error, metadata);
    setUpdateMode(false);
    // Reset the link token if it was in update mode so it can't be used again
    // and reset the selection if the user wants to add a new institution
    // or click a different institution
    if (metadata.status === 'requires_credentials') {
      setLinkToken(null);
    }
  }, []);

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
        .catch((err) => {
          console.error(err);
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
