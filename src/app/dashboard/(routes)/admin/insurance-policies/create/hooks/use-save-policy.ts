import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { insurancePolicyRowsAtom, newPolicyCompanyIdAtom } from '../../atoms';

export const useSavePolicy = () => {
  const router = useRouter();
  const [rows, setRows] = useAtom(insurancePolicyRowsAtom);
  const [companyId, setCompanyId] = useAtom(newPolicyCompanyIdAtom);

  return async (policy_name: string, user_id: string) => {
    if (companyId === -1) {
      throw new Error('No insurance company was selected');
    }

    const { error } = await supabase.rpc('create_insurance_policy', {
      p_user_id: user_id,
      p_company_id: companyId,
      p_name: policy_name,
      p_policy_rows: rows,
    });

    if (error) {
      throw error;
    }

    setRows([]);
    setCompanyId(-1);
    // Refresh the page to get the new policy and retain the state
    router.refresh();
  };
};
