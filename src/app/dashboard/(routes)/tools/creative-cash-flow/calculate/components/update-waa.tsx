import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from '@/components/ui/currency-input';
import { resultsLabels } from '../../labels';
import { creativeCashFlowResultAtom, updatecreativeCashFlowResultWaaAtom } from '../../atoms';

interface UpdateWaaProps {
  originalTotalWaa: number;
}

export function UpdateWaa({ originalTotalWaa }: UpdateWaaProps) {
  const results = useAtomValue(creativeCashFlowResultAtom);
  const updateWaa = useSetAtom(updatecreativeCashFlowResultWaaAtom);
  const [waa, setWaa] = useState(results?.waa.toString() ?? '');
  console.log(results);
  if (!results) {
    return null;
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">{resultsLabels.actual_waa.title}</CardTitle>
        <CardDescription className="text-md">
          {resultsLabels.actual_waa.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <CurrencyInput
          placeholder="$100,000"
          value={waa}
          className="text-lg h-12"
          onValueChange={(value) => setWaa(value ?? '')}
          onBlur={() => {
            updateWaa({
              originalTotalWaa,
              newWaa: parseFloat(waa),
            });
          }}
        />
      </CardContent>
    </>
  );
}
