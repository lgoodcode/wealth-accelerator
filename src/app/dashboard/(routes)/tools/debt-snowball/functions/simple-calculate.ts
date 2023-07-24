import { differenceInMonths } from 'date-fns';

import { moneyRound } from '@/lib/utils/money-round';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculation, DebtPayoff } from '../types';

const NUM_OF_MONTHS = 12;

export const simpleCalculate = (debts: Debt[], target_date?: Date): DebtCalculation => {
  // Get difference in the number of months from the target date to the current date
  let months = target_date ? differenceInMonths(target_date, new Date()) : Infinity;

  if (months < 1) {
    throw new Error('Must be at least one month in the future');
  }

  // Track the debt payoffs by initializing an array of the debts in a DebtPayoff object
  const debtPayoffs: DebtPayoff[] = debts.map((debt) => ({
    debt: structuredClone(debt),
    months: 0,
    total: 0,
    interest: 0,
  }));
  // Track the total amount of debt remaining for each month and year using an array with the years and months as indices
  // with the first index being an array of 12 months
  const debtTracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  // Track the total debt remaining
  const initialTotalDebt = debts.reduce((acc, debt) => acc + debt.amount, 0);
  let totalDebtRemaining = initialTotalDebt;
  let year = 0;

  // Initialize the debt remaining for the first month
  debtTracking[0][0] = totalDebtRemaining;

  // While we still haven't reached the target date and there is still debt remaining
  while (months && totalDebtRemaining) {
    for (let i = 0; i < NUM_OF_MONTHS; i++) {
      let payment = 0;
      // If a debt is paid off, use the remainder for the next debt
      let spillover = 0;

      for (const debtPayoff of debtPayoffs) {
        const { debt } = debtPayoff;

        // If all debts are paid or if the debt is paid off, skip it
        if (!totalDebtRemaining || !debt.amount) {
          continue;
        }

        // Calculate the amortized interest for the month
        const interest = moneyRound(debt.amount * (debt.interest / 100 / 12));
        // Add the interest to the total interest paid
        debtPayoff.interest = moneyRound(debtPayoff.interest + interest);
        // Add the interest to the total balance
        debt.amount += interest;
        // Add a month to the debt payoff
        debtPayoff.months++;

        if (interest >= debt.payment) {
          throw new Error('The interest rate is too high to pay off the debt', {
            cause: 'interest',
          });
        }

        payment += spillover;

        if (debt.amount < payment) {
          debt.amount = 0;
          spillover = payment - debt.amount;
        } else {
          debt.amount -= payment;
          spillover = 0;
        }
      }

      // After running through each debt for the month, calculate the new total debt remaining
      totalDebtRemaining = debtPayoffs.reduce((acc, debtPayoff) => acc + debtPayoff.debt.amount, 0);

      // Update the debt tracking for the month
      debtTracking[year][i] = moneyRound(totalDebtRemaining);

      // Subtract a month from the total months remaining
      months--;

      // If there is no more debt remaining, break out of the loop
      if (!totalDebtRemaining) {
        break;
      }
    }

    // Increment the year and add a new array of 12 months to the debt tracking
    debtTracking[++year] = Array.from({ length: 12 }, () => 0);
  }

  const totalInterestPaid = debtPayoffs.reduce((acc, debtPayoff) => acc + debtPayoff.interest, 0);
  // Find the longest payoff months to determine the payoff date
  const payoffMonths = debtPayoffs.reduce((acc, debtPayoff) => Math.max(acc, debtPayoff.months), 0);
  // Calculate the total amount paid for all debts with the principal and interest
  const totalPaid = initialTotalDebt + totalInterestPaid;

  return {
    debtPayoffs,
    debtTracking,
    totalInterestPaid,
    payoffMonths,
    totalPaid,
  };
};
