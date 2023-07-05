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
import { displaySyncError } from '@/lib/plaid/transactions/displaySyncError';
import {
  updateModeAtom,
  addInstitutionAtom,
  isInsItemIdSyncingOrLoadingAtom,
} from '@/lib/atoms/institutions';
import { Toast } from '@/components/ui/toast';

export const usePlaid = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isGettingLinkToken, setIsGettingLinkToken] = useState(false);
  const [updateMode, setUpdateMode] = useAtom(updateModeAtom);
  const setIsInsItemIdSyncingOrLoading = useSetAtom(isInsItemIdSyncingOrLoadingAtom);
  const addInstitution = useSetAtom(addInstitutionAtom);

  // On successful link, exchange the public token for an access token
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      // Don't need to exchange the token if it's in update mode - the access token has not changed
      if (updateMode) {
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

      const syncError = await clientSyncTransactions(institution.item_id);
      // If there is a sync error, display it and if it's a credential error, set update mode
      // and display a simple toast that the institution was connected
      if (syncError) {
        displaySyncError(syncError, metadata.institution?.name ?? 'Unknown institution');

        if (syncError.plaid?.isCredentialError) {
          setUpdateMode(true);
        }

        toast(
          <Toast title="Connected institution">
            Connected <span className="font-bold">{institutionName}</span>
          </Toast>
        );
      } else {
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
      }

      setIsInsItemIdSyncingOrLoading(null);
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
      if (updateMode && metadata.status === 'requires_credentials') {
        setLinkToken(null);
      }

      setUpdateMode(false);
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
