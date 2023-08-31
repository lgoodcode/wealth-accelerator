import { z } from 'zod';

export const policyInputsSchema = z.object({
  company: z.string({
    required_error: 'Please select an insurance company',
  }),
  file: z.instanceof(Blob, {
    message: 'Please upload a PDF file',
  }),
});

export const policySaveSchema = z.object({
  policy_name: z.string({
    required_error: 'Please enter a policy name',
  }),
  user_id: z.string({
    required_error: 'Please select a user',
  }),
});

const createPolicySchema = z.object({
  user_id: z.string(),
  company_id: z.number(),
  name: z.string(),
  rows: z.array(
    z.object({
      year: z.number(),
      premium: z.number(),
      loan_interest_rate: z.number(),
      age_end_year: z.number(),
      net_cash_value_end_year: z.number(),
      net_death_benefit_end_year: z.number(),
      annual_net_outlay: z.number(),
      cumulative_net_outlay: z.number(),
      net_annual_cash_value_increase: z.number(),
    })
  ),
});

export type PolicyInputsSchemaType = z.infer<typeof policyInputsSchema>;

export type PolicySaveSchemaType = z.infer<typeof policySaveSchema>;

export type CreatePolicySchemaType = z.infer<typeof createPolicySchema>;
