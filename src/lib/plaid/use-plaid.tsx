import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  usePlaidLink,
  type PlaidLinkOptions,
  type PlaidLinkOnEvent,
  type PlaidLinkOnExit,
  type PlaidLinkOnSuccess,
} from 'react-plaid-link';
import { captureException, captureMessage } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { supabase } from '@/lib/supabase/client';
import { getLinkToken } from '@/lib/plaid/get-link-token';
import { exchangeLinkToken } from '@/lib/plaid/exchange-link-token';
import { clientSyncTransactions } from '@/lib/plaid/transactions/client-sync-transactions';
import { displaySyncError } from '@/lib/plaid/transactions/display-sync-error';
import {
  linkTokenAtom,
  updateModeAtom,
  addInstitutionAtom,
  isInsItemIdSyncingOrLoadingAtom,
  selectedInstitutionAtom,
} from '@/lib/plaid/atoms';
import { Toast } from '@/components/ui/toast';
import type { SyncTransactionsResponseError } from './types/sync';

export const usePlaid = () => {
  const [linkToken, setLinkToken] = useAtom(linkTokenAtom);
  const [updateMode, setUpdateMode] = useAtom(updateModeAtom);
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);
  const setIsInsItemIdSyncingOrLoading = useSetAtom(isInsItemIdSyncingOrLoadingAtom);
  const addInstitution = useSetAtom(addInstitutionAtom);
  const [isGettingLinkToken, setIsGettingLinkToken] = useState(false);
  const [hasAttemptedAccountUpdate, setHasAttemptedAccountUpdate] = useState(false);

  // On successful link, exchange the public token for an access token
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      // Don't need to exchange the token if it's in update mode - the access token has not changed
      if (updateMode) {
        if (selectedInstitution?.new_accounts && !hasAttemptedAccountUpdate) {
          setHasAttemptedAccountUpdate(true);

          captureMessage('New accounts update', {
            extra: {
              metadata,
              selectedInstitution,
            },
          });

          const { error } = await supabase
            .from('plaid')
            .update({ new_accounts: false })
            .eq('item_id', selectedInstitution.item_id);

          if (error) {
            console.error(error);
            captureException(error, {
              extra: { selectedInstitution },
            });
            toast.error('Failed to update institution');
          }
        }

        return;
      }

      const { error: tokenError, data: institution } = await exchangeLinkToken({
        public_token,
        metadata,
      });
      const institutionName = metadata.institution?.name ?? 'Unknown institution';

      if (tokenError || !institution) {
        console.error(tokenError ?? new Error('No data returned from exchangeLinkToken'));
        toast.error(
          <Toast title="Syncing transactions">
            Failed to connect <span className="font-bold">{institutionName}</span>
          </Toast>
        );
        return;
      }

      // Add the institution to the list and make the initial transactions sync
      // to get the last 30 days of transactions and to allow Plaid to send the webhooks
      // for the rest of the transactions
      addInstitution(institution);
      setIsInsItemIdSyncingOrLoading(institution.item_id);

      try {
        await clientSyncTransactions(institution.item_id);

        toast.success(
          <Toast title="Connected institution">
            <div className="flex flex-col space-y-3">
              <span>
                <span className="font-bold">{institutionName}</span> is now connected. Transactions
                are now being synced and the last 30 days of transactions are available to be viewed
                while the rest are being retrieved.
              </span>
              <span className="font-extrabold">NOTE: This may take a few minutes.</span>
            </div>
          </Toast>
        );
      } catch (error: any) {
        const initSyncError = error as SyncTransactionsResponseError;
        // If there is a sync error, display it and if it's a credential error, set update mode
        // and display a simple toast that the institution was connected
        if (initSyncError) {
          displaySyncError(initSyncError, metadata.institution?.name ?? 'Unknown institution');

          if (initSyncError.plaid?.isCredentialError) {
            setUpdateMode(true);
            setLinkToken(initSyncError.link_token);
          }

          toast(
            <Toast title="Connected institution">
              Connected <span className="font-bold">{institutionName}</span>
            </Toast>
          );
          setIsInsItemIdSyncingOrLoading(null);
          return;
        }
      }

      /**
       * Run the sync again because the first sync only gets the last 30 days of transactions, which
       * we want to have ready and display to the user as soon as possible. The second sync will get
       * sync the rest of the transactions.
       */
      setTimeout(() => {
        clientSyncTransactions(institution.item_id)
          .then(() => {
            toast.success(
              <Toast title="Synced institution">
                <div className="flex flex-col space-y-3">
                  <span>
                    <span className="font-bold">{institutionName}</span> transaction data is now
                    fully synced. Refresh the pgae to get the latest transactions.
                  </span>
                </div>
              </Toast>
            );
          })
          .catch((syncError) => {
            // If there is a sync error, display it and if it's a credential error, set update mode
            // and display a simple toast that the institution was connected
            if (syncError) {
              displaySyncError(syncError, metadata.institution?.name ?? 'Unknown institution');

              if (syncError.plaid?.isCredentialError) {
                setUpdateMode(true);
                setLinkToken(syncError.link_token);
              }

              toast(
                <Toast title="Connected institution">
                  Connected <span className="font-bold">{institutionName}</span>
                </Toast>
              );
            }
          })
          .finally(() => setIsInsItemIdSyncingOrLoading(null));
      }, 1000);
    },
    [addInstitution, setIsInsItemIdSyncingOrLoading, setUpdateMode, updateMode]
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
      if (updateMode) {
        setLinkToken(null);
        setUpdateMode(false);

        // Once the user has exited the update mode, we can set the flag to false so that
        // it doesn't show the update mode again immediately after exiting
        if (selectedInstitution?.new_accounts && !hasAttemptedAccountUpdate) {
          setHasAttemptedAccountUpdate(true);
        }
      }
    },
    [updateMode]
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

  // Sets update for account update
  useEffect(() => {
    if (!hasAttemptedAccountUpdate && !updateMode && selectedInstitution?.new_accounts) {
      setUpdateMode(true);
      setIsGettingLinkToken(true);

      getLinkToken(selectedInstitution.item_id)
        .then(setLinkToken)
        .catch((error) => {
          console.error(error);
          toast.error('Failed to create update link token');
        })
        .finally(() => setIsGettingLinkToken(false));
    }
  }, [updateMode, selectedInstitution]);

  // Get the link token
  useEffect(() => {
    if (!linkToken) {
      setIsGettingLinkToken(true);

      getLinkToken()
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
