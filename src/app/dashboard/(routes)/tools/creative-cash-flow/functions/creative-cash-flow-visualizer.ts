import { add, differenceInWeeks, differenceInMonths } from 'date-fns';

import { centsToDollars, dollarsToCents } from '@/lib/utils/currency';
import type { WaaInfo } from '@/lib/types/waa-info';
import type { BalancesEntryData } from '@/lib/types/balances';
import type { CcfTransaction } from '../types';

interface CreativeCashFlowManagementArgs {
  interval: 'weekly' | 'monthly';
  business_transactions: CcfTransaction[];
  personal_transactions: CcfTransaction[];
  start_date: Date;
  end_date: Date;
  lifestyle_expenses_tax_rate: number;
  tax_account_rate: number;
  waaInfos: WaaInfo[];
  balances_entries: BalancesEntryData[];
}

const filterTransactionsByDate = (
  transactions: CcfTransaction[],
  start_date: Date,
  end_date: Date
) => {
  return transactions.filter((transaction) => {
    const transaction_time = new Date(transaction.date);
    return transaction_time >= start_date && transaction_time <= end_date;
  });
};

export function visualizeCcf({
  interval,
  business_transactions,
  personal_transactions,
  start_date,
  end_date,
  lifestyle_expenses_tax_rate,
  tax_account_rate,
  waaInfos,
  balances_entries,
}: CreativeCashFlowManagementArgs) {
  if (!business_transactions.length && !personal_transactions.length) {
    throw new Error('There are no transactions to analyze.');
  } else if (!start_date) {
    throw new Error('start_date is not defined');
  } else if (!(start_date instanceof Date)) {
    throw new Error('start_date is not a valid date');
  } else if (!end_date) {
    throw new Error('end_date is not defined');
  } else if (!(end_date instanceof Date)) {
    throw new Error('end_date is not a valid date');
  } else if (!lifestyle_expenses_tax_rate) {
    throw new Error('lifestyle_expenses_tax_rate is not defined');
  } else if (!tax_account_rate) {
    throw new Error('tax_account_rate is not defined');
  } else if (!waaInfos) {
    throw new Error('waaInfos is not defined');
  } else if (!balances_entries) {
    throw new Error('balances_entries is not defined');
  }

  // Convert the dollars to cents
  business_transactions = business_transactions.map((transaction) => ({
    ...transaction,
    amount: dollarsToCents(transaction.amount),
  }));
  personal_transactions = personal_transactions.map((transaction) => ({
    ...transaction,
    amount: dollarsToCents(transaction.amount),
  }));
  waaInfos = waaInfos.map((waaInfo) => ({
    ...waaInfo,
    amount: dollarsToCents(waaInfo.amount),
  }));
  balances_entries = balances_entries.map((entry) => ({
    ...entry,
    amount: dollarsToCents(entry.amount),
  }));

  // Convert the tax rates to decimal values
  lifestyle_expenses_tax_rate /= 100;
  tax_account_rate /= 100;

  const duration: keyof Duration = interval === 'weekly' ? 'weeks' : 'months';
  // Get the number of periods based on the interval with date-fns
  const num_periods =
    interval === 'weekly'
      ? differenceInWeeks(end_date, start_date)
      : differenceInMonths(end_date, start_date);

  const results = [];
  let collections = 0;
  let business_overhead = 0;
  let lifestyle_expenses = 0;

  for (let i = 0; i < num_periods; i++) {
    // Get the start and end dates for this window
    const window_start_date = add(start_date, { [duration]: i });
    const _window_end_date = add(window_start_date, { [duration]: 1 });
    const window_end_date = _window_end_date > end_date ? end_date : _window_end_date;
    // Get the transactions within this window
    const window_business_transactions = filterTransactionsByDate(
      business_transactions,
      window_start_date,
      window_end_date
    );
    const window_personal_transactions = filterTransactionsByDate(
      personal_transactions,
      window_start_date,
      window_end_date
    );
    // Get the WaaInfo within this range
    const window_waa_infos = waaInfos.filter((waaInfo) => {
      const waaInfoDate = new Date(waaInfo.date);
      return waaInfoDate >= window_start_date && waaInfoDate <= window_end_date;
    });
    // Get the balances entries within this range
    const window_balances_entries = balances_entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= window_start_date && entryDate <= window_end_date;
    });

    for (const transaction of window_business_transactions) {
      if (transaction.category === 'Money-In') {
        collections -= transaction.amount;
      } else {
        business_overhead += transaction.amount;
      }
    }

    business_overhead = Math.max(business_overhead, 0);

    for (const transaction of window_personal_transactions) {
      if (transaction.category === 'Money-Out') {
        lifestyle_expenses += transaction.amount;
      }
    }

    const lifestyle_expenses_tax = lifestyle_expenses * lifestyle_expenses_tax_rate;
    const business_profit_before_tax =
      collections - business_overhead - lifestyle_expenses - lifestyle_expenses_tax;
    const tax_account =
      business_profit_before_tax > 0 ? business_profit_before_tax * tax_account_rate : 0;
    const waa =
      business_profit_before_tax > 0 ? business_profit_before_tax - tax_account : collections / 10;

    results.push({
      range: {
        start: window_start_date,
        end: window_end_date,
      },
      collections: centsToDollars(collections),
      waa: centsToDollars(window_waa_infos.reduce((acc, waaInfo) => acc + waaInfo.amount, 0)),
      balance: centsToDollars(
        window_balances_entries.reduce((acc, entry) => acc + entry.amount, 0)
      ),
      // lifestyle_expenses: centsToDollars(lifestyle_expenses),
      // lifestyle_expenses_tax: centsToDollars(lifestyle_expenses_tax),
      // business_profit_before_tax: centsToDollars(business_profit_before_tax),
      // business_overhead: centsToDollars(business_overhead),
      // tax_account: centsToDollars(tax_account),
      // waa: centsToDollars(waa),
      // // waa: centsToDollars(waa),
      // // daily_trend: daily_trend.map((trend) => centsToDollars(trend)),
      // // weekly_trend: daily_trend.map((trend) => centsToDollars(trend * DAYS_IN_WEEK)),
      // // yearly_trend: daily_trend.map((trend) => centsToDollars(trend * DAYS_IN_YEAR)),
    });

    collections = 0;
    business_overhead = 0;
    lifestyle_expenses = 0;
  }

  return results;
}
