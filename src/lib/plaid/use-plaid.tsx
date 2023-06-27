import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  usePlaidLink,
  type PlaidLinkOptions,
  type PlaidLinkOnEvent,
  type PlaidLinkOnExit,
  type PlaidLinkOnSuccess,
} from 'react-plaid-link';
import { captureException } from '@sentry/nextjs';

import { createLinkToken } from '@/lib/plaid/create-link-token';
import { exchangeLinkToken } from '@/lib/plaid/exchange-link-token';
import { toast } from '@/hooks/use-toast';

export const usePlaid = () => {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [isGettingLinkToken, setIsGettingLinkToken] = useState(false);

  // On successful link, exchange the public token for an access token
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      exchangeLinkToken({ public_token, metadata })
        .then(() => router.refresh()) // Need to refresh the page to get the new data
        .catch((err) => {
          console.error(err);
          captureException(err);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: err,
          });
        });

      toast({
        variant: 'success',
        title: 'Plaid connected',
        description: `Successfully connected ${
          metadata?.institution?.name ?? 'Unknown institution'
        }.\nPlease wait a moment for the update to appear.`,
      });
    },
    [router]
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
      createLinkToken().then(setLinkToken);
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
          captureException(err);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to create link token',
          });
        })
        .finally(() => setIsGettingLinkToken(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkToken]);

  return {
    open,
    ready,
    isGettingLinkToken,
  };
};
