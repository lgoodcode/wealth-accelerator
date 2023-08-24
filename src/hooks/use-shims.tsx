'use client';

import { useEffect } from 'react';

import { structuredCloneShim } from '@/lib/utils/structured-clone-shim';

export function useShims() {
  useEffect(() => {
    console.log('shimmy');
    structuredCloneShim();
  }, []);
}
