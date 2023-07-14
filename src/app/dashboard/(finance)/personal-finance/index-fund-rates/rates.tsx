'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { ratesAtom } from './atoms';
import { RatesForm } from './rates-form';

interface RatesProps {
  user: User;
  ratesData: number[] | null;
}

export function Rates({ user, ratesData }: RatesProps) {
  const [rates, setRates] = useAtom(ratesAtom);

  useEffect(() => {
    setRates(ratesData);
    // if (ratesData) {
    //   setRates(
    //     ratesData.map((rate) => ({
    //       label: rate.toString(),
    //       value: rate,
    //     }))
    //   );
    // }
  }, []);

  return <RatesForm user={user} rates={rates} />;
}
