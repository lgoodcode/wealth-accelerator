export type InsuranceCompanies = 'Mass Mutual' | 'Lafayette Life' | 'AUL Inforce';

export type InsuranceCompany = {
  id: number;
  name: InsuranceCompanies;
};

export type InsurancePolicy = {
  id: number;
  user_id: string;
  company_id: number;
  name: string;
};

export type InsurancePolicyRow = {
  id: number;
  policy_id: number;
  year: number;
  premium: number;
  loan_interest_rate: number;
  age_end_year: number;
  net_cash_value_end_year: number;
  net_death_benefit_end_year: number;
  annual_net_outlay: number;
  cumulative_net_outlay: number;
  net_annual_cash_value_increase: number;
};

export type InsurancePolicyWithRows = InsurancePolicy & {
  rows: InsurancePolicyRow[];
};

export type UserInsurancePolicies = {
  user: {
    id: number;
    name: string;
  };
  policies: InsurancePolicyWithRows[];
};

export type UserInsurancePolicyView = {
  user: {
    id: number;
    name: string;
  };
  policy: {
    id: number;
    name: string;
  };
  company_name: {
    id: number;
    name: InsuranceCompanies;
  };
};

export type WindowWithPdfJs = Window &
  typeof globalThis & {
    pdfjsLib: any;
  };

export type PdfParser = (file: Blob) => Promise<InsurancePolicyRow[]>;
