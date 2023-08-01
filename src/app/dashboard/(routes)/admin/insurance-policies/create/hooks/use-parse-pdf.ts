import { massMutualParser } from '../pdf/mass-mutual-parser';
import { lafayetteParser } from '../pdf/lafayette-parser';
import { aulInforceParser } from '../pdf/aul-inforce-parser';
import { InsuranceCompany } from '../../types';

export const useParsePdf = (companies: InsuranceCompany[]) => {
  return async (company_id: number, file: Blob) => {
    const company = companies.find((c) => c.id === company_id);

    if (!company) {
      throw new Error(`No company found for ${company_id}`);
    }

    switch (company.name) {
      case 'Mass Mutual':
        return await massMutualParser(file);

      case 'Lafayette Life':
        return await lafayetteParser(file);

      case 'AUL Inforce':
        return await aulInforceParser(file);

      default:
        throw new Error(`No parser found for ${company.name}`);
    }
  };
};
