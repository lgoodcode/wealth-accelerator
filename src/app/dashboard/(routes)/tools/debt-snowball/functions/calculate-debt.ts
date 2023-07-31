import { differenceInMonths } from 'date-fns';

import { moneyRound } from '@/lib/utils/money-round';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculation, DebtPayoff } from '../types';

const NUM_OF_MONTHS = 12;

export const calculate_debt = (
  debts: Debt[],
  options: {
    isDebtSnowball?: boolean;
    isWealthAccelerator?: boolean;
    additional_payment?: number;
    lump_amounts?: number[];
    target_date?: Date;
  }
): DebtCalculation => {
  // Get difference in the number of months from the target date to the current date
  let months = options?.target_date
    ? differenceInMonths(options.target_date, new Date())
    : Infinity;

  if (months < 1) {
    throw new Error('Must be at least one month in the future');
  }

  // Track the debt payoffs by initializing an array of the debts in a DebtPayoff object
  const debt_payoffs: DebtPayoff[] = debts.map((debt) => ({
    debt: structuredClone(debt),
    months: 0,
    total: 0,
    interest: 0,
  }));
  // Track the total amount of debt remaining for each month and year using an array with the years and months as indices
  // with the first index being an array of 12 months
  const balance_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const interest_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  // Track the total debt remaining
  const intitial_total_debt = debts.reduce((acc, debt) => acc + debt.amount, 0);
  let balance_remaining = intitial_total_debt;

  // Initialize the debt remaining for the first month
  balance_tracking[0][0] = balance_remaining;

  for (let year = 0; months && balance_remaining; year++) {
    // If a debt is paid off, use the remainder for the next debt
    // If we are using the Wealth Accelerator, apply the lump sum to the spillover to use for the debts
    let spillover = options?.isWealthAccelerator ? options?.lump_amounts?.[year] ?? 0 : 0;

    for (let month = 0; month < NUM_OF_MONTHS && months; month++) {
      // Add the additional monthly payments
      spillover += options?.additional_payment ?? 0;

      // If we are using the debt snowball strategy, add up the debt payments for any debts that are
      // paid off to use to pay towards other debts if we are using
      // the debt snowball strategy
      if (options?.isDebtSnowball) {
        spillover += debt_payoffs.reduce(
          (acc, debtPayoff) => acc + (debtPayoff.debt.amount ? 0 : debtPayoff.debt.payment),
          0
        );
      }

      for (const debtPayoff of debt_payoffs) {
        const { debt } = debtPayoff;
        const payment = debt.payment + spillover;

        // If all debts are paid or if the debt is paid off, skip it
        if (!balance_remaining || !debt.amount) {
          continue;
        }

        // Calculate the amortized interest for the month
        const interest = moneyRound(debt.amount * (debt.interest / 100 / 12));
        // Add the interest to the total interest paid for the month
        interest_tracking[year][month] = moneyRound(interest_tracking[year][month] + interest);
        // Add the interest to the total interest paid
        debtPayoff.interest = moneyRound(debtPayoff.interest + interest);
        // Add the interest to the total balance
        debt.amount = moneyRound(debt.amount + interest);
        // Add a month to the debt payoff
        debtPayoff.months++;

        if (interest >= payment) {
          throw new Error('The interest rate is too high to pay off the debt', {
            cause: debt.description,
          });
        }

        if (debt.amount < payment) {
          spillover = moneyRound(payment - debt.amount);
          debt.amount = 0;
        } else {
          debt.amount = moneyRound(debt.amount - payment);
          spillover = 0;
        }
      }

      // After running through each debt for the month, calculate the new total debt remaining
      balance_remaining = debt_payoffs.reduce((acc, debtPayoff) => acc + debtPayoff.debt.amount, 0);

      // Update the debt tracking for the month
      balance_tracking[year][month] = moneyRound(balance_remaining);

      // Subtract a month from the total months remaining
      months--;

      // If there is no more debt remaining, break out of the loop
      if (!balance_remaining) {
        break;
      }
    }

    // If there's still an outstanding balance - increment the year and
    // add a new array of 12 months to the debt tracking
    if (balance_remaining) {
      balance_tracking[year + 1] = Array.from({ length: 12 }, () => 0);
      interest_tracking[year + 1] = Array.from({ length: 12 }, () => 0);
    }
  }

  const total_interest = debt_payoffs.reduce((acc, debtPayoff) => acc + debtPayoff.interest, 0);
  // Find the longest payoff months to determine the payoff date
  const payoff_months = debt_payoffs.reduce(
    (acc, debtPayoff) => Math.max(acc, debtPayoff.months),
    0
  );
  // Calculate the total amount paid for all debts with the principal and interest
  const total_amount = intitial_total_debt + total_interest;

  return {
    debt_payoffs,
    balance_tracking,
    interest_tracking,
    payoff_months: payoff_months,
    total_interest: moneyRound(total_interest),
    total_amount: moneyRound(total_amount),
  };
};
