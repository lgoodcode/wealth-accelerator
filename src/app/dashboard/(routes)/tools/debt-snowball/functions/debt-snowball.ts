import { differenceInMonths } from 'date-fns';

import { moneyRound } from '@/lib/utils/money-round';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculation, DebtPayoff } from '../types';

const NUM_OF_MONTHS = 12;

export const snowballCalculation = (
  snowball: number,
  debts: Debt[],
  target_date?: Date
): DebtCalculation => {
  // Get difference in the number of months from the target date to the current date
  let months = target_date ? differenceInMonths(target_date, new Date()) : Infinity;

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
  const debt_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  // Track the total debt remaining
  const initial_total_debt = debts.reduce((acc, debt) => acc + debt.amount, 0);
  let total_debt_remaining = initial_total_debt;
  let year = 0;

  // Initialize the debt remaining for the first month
  debt_tracking[0][0] = total_debt_remaining;

  // While we still haven't reached the target date and there is still debt remaining
  while (months && total_debt_remaining) {
    for (let i = 0; i < NUM_OF_MONTHS; i++) {
      let monthly_payment = snowball;

      for (const debtPayoff of debt_payoffs) {
        const { debt } = debtPayoff;

        // If all debts are paid or if the debt is paid off, skip it
        if (!total_debt_remaining || !debt.amount) {
          continue;
        }

        // Calculate the amortized interest for the month
        const interest = moneyRound(debt.amount * (debt.interest / 100 / 12));
        // Add the interest to the total interest paid
        debtPayoff.interest = moneyRound(debtPayoff.interest + interest);
        // Add the interest to the total balance
        debt.amount = moneyRound(debt.amount + interest);
        // Add a month to the debt payoff
        debtPayoff.months++;

        // If we have no more money for the month, skip the debt
        if (!monthly_payment) {
          continue;
        }

        if (interest >= snowball) {
          throw new Error('The interest rate is too high to pay off the debt', {
            cause: 'interest',
          });
        }

        // Subtract the interest from the payment to get the amount paid towards the principal
        const payment = Math.min(debt.amount, monthly_payment);

        // Subtract from the monthly payment, the amount paid towards the principal
        monthly_payment = moneyRound(monthly_payment - payment);

        // Subtract the payment from the debt amount
        debt.amount = moneyRound(debt.amount - payment);
      }

      // After running through each debt for the month, calculate the new total debt remaining
      total_debt_remaining = debt_payoffs.reduce(
        (acc, debtPayoff) => acc + debtPayoff.debt.amount,
        0
      );

      // Update the debt tracking for the month
      debt_tracking[year][i] = moneyRound(total_debt_remaining);

      // Subtract a month from the total months remaining
      months--;

      // If there is no more debt remaining, break out of the loop
      if (!total_debt_remaining) {
        break;
      }
    }

    // Increment the year and add a new array of 12 months to the debt tracking
    debt_tracking[++year] = Array.from({ length: 12 }, () => 0);
  }

  const total_interest = debt_payoffs.reduce((acc, debtPayoff) => acc + debtPayoff.interest, 0);
  // Find the longest payoff months to determine the payoff date
  const payoff_months = debt_payoffs.reduce(
    (acc, debtPayoff) => Math.max(acc, debtPayoff.months),
    0
  );
  // Calculate the total amount paid for all debts with the principal and interest
  const total_paid = initial_total_debt + total_interest;

  return {
    debt_payoffs: debt_payoffs,
    debt_tracking: debt_tracking,
    payoff_months: payoff_months,
    total_interest: moneyRound(total_interest),
    total_amount: moneyRound(total_paid),
  };
};
