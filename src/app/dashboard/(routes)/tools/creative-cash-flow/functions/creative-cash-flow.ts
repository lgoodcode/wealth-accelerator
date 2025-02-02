import { centsToDollars, dollarsToCents } from '@/lib/utils/currency';
import type { CreativeCashFlowManagementArgs, CreativeCashFlowManagementResult } from '../types';

const MONTH_LENGTH = 30;
const DAYS_IN_WEEK = 7;
const DAYS_IN_YEAR = 365;
const MS_IN_DAY = 86400000;

export function creativeCashFlowManagement({
  business_transactions,
  personal_transactions,
  ytd_collections,
  start_date,
  end_date,
  all_other_income,
  payroll_and_distributions,
  lifestyle_expenses_tax_rate,
  tax_account_rate,
}: CreativeCashFlowManagementArgs): Omit<CreativeCashFlowManagementResult, 'actual_waa'> {
  // Convert the tax rates to decimal values
  lifestyle_expenses_tax_rate /= 100;
  tax_account_rate /= 100;

  // Convert the dollars to cents
  business_transactions = business_transactions.map((transaction) => ({
    ...transaction,
    amount: dollarsToCents(transaction.amount),
  }));
  personal_transactions = personal_transactions.map((transaction) => ({
    ...transaction,
    amount: dollarsToCents(transaction.amount),
  }));
  ytd_collections = dollarsToCents(ytd_collections);
  all_other_income = dollarsToCents(all_other_income);
  payroll_and_distributions = dollarsToCents(payroll_and_distributions);

  // Verify the tax rates are decimal values.
  if (lifestyle_expenses_tax_rate > 1 || tax_account_rate > 1) {
    throw new Error('The tax rates must be decimal values.');
  } else if (!start_date) {
    throw new Error('start_date is not defined');
  } else if (!(start_date instanceof Date)) {
    throw new Error('start_date is not a valid date');
  } else if (!end_date) {
    throw new Error('end_date is not defined');
  }

  const start_time = start_date.getTime();
  const end_time = end_date.getTime();

  let collections = all_other_income;
  let business_overhead = -payroll_and_distributions;
  let lifestyle_expenses = 0;
  const col = [];
  const busi = [];
  const life = [];

  // console.log({
  //   business_transactions,
  //   personal_transactions,
  // });
  // console.group('collections');

  for (const transaction of business_transactions) {
    const transaction_time = new Date(transaction.date).getTime();

    if (
      transaction_time >= start_time &&
      transaction_time <= end_time &&
      transaction.category !== 'Transfer'
    ) {
      if (transaction.category === 'Money-In') {
        col.push({
          name: transaction.name,
          category: transaction.category,
          date: transaction.date,
          amount: transaction.amount,
        });
        collections -= transaction.amount;
      } else {
        busi.push({
          name: transaction.name,
          category: transaction.category,
          date: transaction.date,
          amount: transaction.amount,
        });
        business_overhead += transaction.amount;
      }
    }
  }

  // console.log('collections', col);
  // console.log('business_overhead', busi);

  // console.groupEnd();
  // console.group('personal');

  business_overhead = Math.max(business_overhead, 0);

  for (const transaction of personal_transactions) {
    const transaction_time = new Date(transaction.date).getTime();

    if (
      transaction_time >= start_time &&
      transaction_time <= end_time &&
      transaction.category === 'Money-Out'
    ) {
      life.push({
        name: transaction.name,
        category: transaction.category,
        date: transaction.date,
        amount: transaction.amount,
      });
      lifestyle_expenses += transaction.amount;
    }
  }

  // console.groupEnd();

  const lifestyle_expenses_tax = lifestyle_expenses * lifestyle_expenses_tax_rate;
  const business_profit_before_tax =
    collections - business_overhead - lifestyle_expenses - lifestyle_expenses_tax;
  const tax_account =
    business_profit_before_tax > 0 ? business_profit_before_tax * tax_account_rate : 0;
  const waa =
    business_profit_before_tax > 0 ? business_profit_before_tax - tax_account : collections / 10;
  const monthly_trend = [0, 0, 0];
  const current_year = new Date().getFullYear();
  let year_to_date = 0;

  for (const transaction of business_transactions) {
    if (transaction.category === 'Transfer') {
      continue;
    }

    const diff_in_days = Math.abs(
      Math.round(
        new Date().getTime() / MS_IN_DAY - new Date(transaction.date).getTime() / MS_IN_DAY
      )
    );

    if (diff_in_days <= MONTH_LENGTH * 3 && transaction.category === 'Money-In') {
      monthly_trend[2] -= transaction.amount;

      if (diff_in_days <= MONTH_LENGTH * 2) {
        monthly_trend[1] -= transaction.amount;

        if (diff_in_days <= MONTH_LENGTH) {
          monthly_trend[0] -= transaction.amount;
        }
      }
    }

    if (
      current_year === new Date(transaction.date).getFullYear() &&
      transaction.category === 'Money-In'
    ) {
      year_to_date -= transaction.amount;
    }
  }

  const daily_trend = [
    monthly_trend[0] / MONTH_LENGTH,
    monthly_trend[1] / (MONTH_LENGTH * 2),
    monthly_trend[2] / (MONTH_LENGTH * 3),
  ];

  return {
    collections: centsToDollars(collections),
    lifestyle_expenses: centsToDollars(lifestyle_expenses),
    lifestyle_expenses_tax: centsToDollars(lifestyle_expenses_tax),
    business_profit_before_tax: centsToDollars(business_profit_before_tax),
    business_overhead: centsToDollars(business_overhead),
    tax_account: centsToDollars(tax_account),
    waa: centsToDollars(waa),
    daily_trend: daily_trend.map((trend) => centsToDollars(trend)),
    weekly_trend: daily_trend.map((trend) => centsToDollars(trend * DAYS_IN_WEEK)),
    yearly_trend: daily_trend.map((trend) => centsToDollars(trend * DAYS_IN_YEAR)),
    year_to_date: centsToDollars(year_to_date + ytd_collections),
  };
}
