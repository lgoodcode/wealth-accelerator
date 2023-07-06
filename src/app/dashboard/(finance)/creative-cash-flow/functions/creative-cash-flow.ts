import { differenceInMilliseconds, getMilliseconds } from 'date-fns';

import type { Transaction } from '@/lib/plaid/types/transactions';

const MONTH_LENGTH = 30;
const DAYS_IN_WEEK = 7;
const DAYS_IN_YEAR = 365;

export type CreativeCashFlowManagementArgs = {
  businessTransactions: Transaction[];
  personalTransactions: Transaction[];
  startDate: Date;
  endDate: Date;
  allOtherIncome: number;
  payrollAndDistributions: number;
  /** The rate is given as a whole number and needs to be divided by 100 */
  lifestyleExpensesTaxRate: number;
  /** The rate is given as a whole number and needs to be divided by 100 */
  taxAccountRate: number;
};

export type CreativeCashFlowManagementResult = ReturnType<typeof creativeCashFlowManagement>;

export function creativeCashFlowManagement({
  businessTransactions,
  personalTransactions,
  startDate,
  endDate,
  allOtherIncome,
  payrollAndDistributions,
  lifestyleExpensesTaxRate,
  taxAccountRate,
}: CreativeCashFlowManagementArgs) {
  // Verify the tax rates are decimal values.
  if (lifestyleExpensesTaxRate > 1 || taxAccountRate > 1) {
    throw new Error('The tax rates must be decimal values.');
  } else if (!(startDate instanceof Date)) {
    throw new Error('startDate is not a valid date');
  } else if (!(endDate instanceof Date)) {
    throw new Error('endDate is not a valid date');
  }

  const startTime = startDate.setHours(0, 0, 0, 0);
  const endTime = endDate.setHours(23, 59, 59, 999);

  let collections = allOtherIncome;
  let businessOverhead = -payrollAndDistributions;
  let lifestyleExpenses = 0;
  const col = [];
  const busi = [];
  const life = [];

  console.group('collections');
  // Calculates collections and businessOverhead from the business account(s).
  for (const transaction of businessTransactions) {
    const transactionTime = getMilliseconds(new Date(transaction.date));

    // If the transaction occurred during the specified date range, include it in collections OR businessOverhead.
    if (
      transactionTime >= startTime &&
      transactionTime <= endTime &&
      transaction.category !== 'Transfer'
    ) {
      // If the transaction is negative, then it is money coming in, so add it to collections.
      if (transaction.category === 'Money-In') {
        col.push({
          name: transaction.name,
          category: transaction.category,
          date: transaction.date,
          amount: transaction.amount,
        });
        collections -= transaction.amount;
        // If the transaction is positive, then it is money going out, so add it to businessOverhead.
      } else {
        busi.push({
          name: transaction.name,
          category: transaction.category,
          date: transaction.date,
          amount: transaction.amount,
        });
        businessOverhead += transaction.amount;
      }
    }
  }
  console.log('collections', col);
  console.log('businessOverhead', busi);

  console.groupEnd();
  console.group('personal');
  // If business overhead is negative, just set it to 0.
  businessOverhead = Math.max(businessOverhead, 0);

  // Calculates lifestyleExpenses from the personal account(s).
  for (const transaction of personalTransactions) {
    const transactionTime = getMilliseconds(new Date(transaction.date));

    // If the transaction occured during the specified date range AND it is positive,
    // then it is money going out, so add it to lifestyleExpenses.
    if (
      transactionTime >= startTime &&
      transactionTime <= endTime &&
      transaction.category === 'Money-Out'
    ) {
      life.push({
        name: transaction.name,
        category: transaction.category,
        date: transaction.date,
        amount: transaction.amount,
      });
      lifestyleExpenses += transaction.amount;
    }
  }

  console.log('lifestyleExpenses', life);
  console.groupEnd();

  const lifestyleExpensesTax = lifestyleExpenses * lifestyleExpensesTaxRate;
  const businessProfitBeforeTax =
    collections - businessOverhead - lifestyleExpenses - lifestyleExpensesTax;
  // If businessProfitBeforeTax is negative, set the tax to 0 otherwise, calculate the taxAccount
  const taxAccount = businessProfitBeforeTax > 0 ? businessProfitBeforeTax * taxAccountRate : 0;
  // If the business profit is negative then the WAA is 10% of the collections otherwise it is the
  // difference between collections and businessOverhead and lifestyleExpenses + taxes
  const WAA = businessProfitBeforeTax > 0 ? businessProfitBeforeTax - taxAccount : collections / 10;
  const monthlyTrend = [0, 0, 0];
  const currentYear = new Date().getFullYear();
  let yearToDate = 0;

  for (const transaction of businessTransactions) {
    if (transaction.category === 'Transfer') {
      continue;
    }

    const diffInDays = Math.abs(differenceInMilliseconds(new Date(transaction.date), new Date()));
    // If the transaction occured within the past 90 days, add it to the 3 month trend.
    if (diffInDays <= MONTH_LENGTH * 3 && transaction.category === 'Money-In') {
      monthlyTrend[2] -= transaction.amount;
      // If the transaction occured within the past 60 days, add it to the 2 month trend.
      if (diffInDays <= MONTH_LENGTH * 2) {
        monthlyTrend[1] -= transaction.amount;
        // If the transaction occured within the past 30 days, add it to the 1 month trend.
        if (diffInDays <= MONTH_LENGTH) {
          monthlyTrend[0] -= transaction.amount;
        }
      }
    }
    // If the transaction occured within the current year, add it to the yearToDate trend.
    if (
      currentYear === new Date(transaction.date).getFullYear() &&
      transaction.category === 'Money-In'
    ) {
      yearToDate -= transaction.amount;
    }
  }

  // Calculates the dailyTrend from the monthlyTrend by dividing by the number of days in the period;
  // the result can be understood to be a daily average.
  const dailyTrend = [
    monthlyTrend[0] / MONTH_LENGTH,
    monthlyTrend[1] / (MONTH_LENGTH * 2),
    monthlyTrend[2] / (MONTH_LENGTH * 3),
  ];
  // Calculates the weeklyTrend by multiplying each dailyTrend by 7; the result can be understood to
  // be a weekly average.
  const weeklyTrend = dailyTrend.map((trend) => trend * DAYS_IN_WEEK);
  // Calculates the weeklyTrend by multiplying each dailyTrend by 365; the result can be understood to
  // be a weekly average.
  const yearlyTrend = dailyTrend.map((trend) => trend * DAYS_IN_YEAR);

  return {
    collections,
    lifestyleExpenses,
    lifestyleExpensesTax,
    businessProfitBeforeTax,
    businessOverhead,
    taxAccount,
    WAA,
    weeklyTrend,
    monthlyTrend,
    yearlyTrend,
    yearToDate,
  };
}
