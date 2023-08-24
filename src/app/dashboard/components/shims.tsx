'use client';

import { useEffect } from 'react';

import { structuredCloneShim } from '@/lib/utils/structured-clone-shim';

export function Shims() {
  useEffect(() => {
    structuredCloneShim();
  }, []);

  return null;
}
