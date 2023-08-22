import { useAtomValue, useSetAtom } from 'jotai';

import { Input } from '@/components/ui/input';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { resultsLabels } from '../../labels';
import { creativeCashFlowResultAtom, updatecreativeCashFlowResultWaaAtom } from '../../atoms';

interface UpdateWaaProps {
  originalWaa: number;
}

export function UpdateWaa({ originalWaa }: UpdateWaaProps) {
  const results = useAtomValue(creativeCashFlowResultAtom);
  const updateWaa = useSetAtom(updatecreativeCashFlowResultWaaAtom);

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
        <Input
          type="number"
          min={0}
          step={1}
          placeholder="$100,000"
          value={results.waa.toString()}
          onChange={(e) =>
            updateWaa({
              originalWaa,
              newWaa: parseInt(e.target.value) || 0,
            })
          }
        />
      </CardContent>
    </>
  );
}
