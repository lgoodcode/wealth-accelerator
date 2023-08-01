import { useSetAtom } from 'jotai';

import { insurancePolicyRowsAtom } from '../../atoms';

export const useDeleteRow = () => {
  const removeRow = useSetAtom(insurancePolicyRowsAtom);

  return (rowId: number) => {
    removeRow((rows) =>
      rows
        .filter((row) => row.id !== rowId)
        .map((row) => {
          if (row.id > rowId) {
            return {
              ...row,
              age_end_year: row.age_end_year - 1,
              year: row.year - 1,
            };
          }

          return row;
        })
    );
  };
};
