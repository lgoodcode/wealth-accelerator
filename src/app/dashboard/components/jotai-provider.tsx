'use client';

import { Provider } from 'jotai';

interface JotaiProviderProps {
  children: React.ReactNode;
}

/**
 * The provider is used to clear all atoms by remounting when the user logs out.
 */
export function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}
