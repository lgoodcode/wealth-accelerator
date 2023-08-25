import { centsToDollars, dollarsToCents } from '@/lib/utils/currency';
import type { Debt } from '@/lib/types/debts';
import type { DebtPayoff, SimpleDebtCalculation } from '../types';

const NUM_OF_MONTHS = 12;

export const simple_calculate = (debts: Debt[]): SimpleDebtCalculation => {
  // Track the debt payoffs by initializing an array of the debts in a DebtPayoff object
  const debt_payoffs: DebtPayoff[] = debts.map((debt) => ({
    debt: {
      ...debt,
      amount: dollarsToCents(debt.amount),
      payment: dollarsToCents(debt.payment),
    },
    months: 0,
    total: 0,
    interest: 0,
    payment_tracking: [Array.from({ length: 12 }, () => 0)],
  }));
  // Track the total amount of debt remaining for each month and year using an array with the years and months as indices
  // with the first index being an array of 12 months
  const balance_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const interest_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const intitial_total_debt = debts.reduce((acc, debt) => acc + dollarsToCents(debt.amount), 0); // Get the cents from the dollars
  let balance_remaining = intitial_total_debt;
  let year = 0;

  // Initialize the debt remaining for the first month
  balance_tracking[0][0] = intitial_total_debt;

  while (balance_remaining) {
    for (let month = 0; month < NUM_OF_MONTHS; month++) {
      for (const debtPayoff of debt_payoffs) {
        const { debt } = debtPayoff;

        // If the debt is paid off, skip it
        if (!debt.amount) {
          continue;
        }

        // Calculate the amortized interest for the month:
        //  Divide by 12 to get the monthly interest
        const interest = debt.amount * (debt.interest / 100 / 12);
        // Add the interest to the total interest paid for the month
        interest_tracking[year][month] += interest;
        // Add the interest to the total interest paid
        debtPayoff.interest += interest;
        // Add the interest to the total balance
        debt.amount += interest;
        // Add a month to the debt payoff
        debtPayoff.months++;

        if (interest >= debt.payment) {
          throw new Error('The interest rate is too high to pay off the debt', {
            cause: debt.description,
          });
        }

        // If the debt amount remaining is less than the payment
        if (debt.amount < debt.payment) {
          // Take the debt amount and use it for the payment for this month for this debt
          debtPayoff.payment_tracking[year][month] = debt.amount;
          debt.amount = 0;
          // Otherwise, use the payment towards the debt amount
        } else {
          debtPayoff.payment_tracking[year][month] = debt.payment;
          debt.amount -= debt.payment;
        }
      } // End of for-each debt

      // After running through each debt for the month, calculate the new total debt remaining
      balance_remaining = debt_payoffs.reduce((acc, debtPayoff) => acc + debtPayoff.debt.amount, 0);

      // Update the total debt balance tracking for the month
      balance_tracking[year][month] = balance_remaining;

      // If there is no more debt remaining, remove the remaining empty months and break out of the loop
      if (!balance_remaining) {
        balance_tracking[year] = balance_tracking[year].slice(0, month + 1);
        break;
      }
    } // End of for-each month

    // If there's still an outstanding balance - increment the year and
    // add a new array of 12 months for the new year to the debt tracking arrays
    if (balance_remaining) {
      year++;
      balance_tracking[year] = Array.from({ length: 12 }, () => 0);
      interest_tracking[year] = Array.from({ length: 12 }, () => 0);
      debt_payoffs.forEach((debtPayoff) => {
        debtPayoff.payment_tracking[year] = Array.from({ length: 12 }, () => 0);
      });
    }
  } // End of years - no more balance remaining

  /**
   * Calculate the totals and convert the cents to dollars
   */

  const total_interest = debt_payoffs.reduce((acc, debtPayoff) => acc + debtPayoff.interest, 0);
  const total_interest_dollars = centsToDollars(total_interest);
  // Find the longest payoff months to determine the payoff date
  const payoff_months = debt_payoffs.reduce(
    (acc, debtPayoff) => Math.max(acc, debtPayoff.months),
    0
  );
  // Calculate the total amount paid for all debts with the principal and interest
  const total_amount = intitial_total_debt + total_interest;
  const total_amount_dollars = centsToDollars(total_amount);

  const debt_payoffs_dollars = debt_payoffs.map((debtPayoff) => ({
    ...debtPayoff,
    debt: {
      ...debtPayoff.debt,
      amount: centsToDollars(debtPayoff.debt.amount),
      payment: centsToDollars(debtPayoff.debt.payment),
    },
    interest: centsToDollars(debtPayoff.interest),
    payment_tracking: debtPayoff.payment_tracking.map((year) => year.map(centsToDollars)),
  }));
  const balance_tracking_dollars = balance_tracking.map((year) => year.map(centsToDollars));
  const interest_tracking_dollars = interest_tracking.map((year) => year.map(centsToDollars));

  return {
    debt_payoffs: debt_payoffs_dollars,
    balance_tracking: balance_tracking_dollars,
    interest_tracking: interest_tracking_dollars,
    payoff_months: payoff_months,
    total_interest: total_interest_dollars,
    total_amount: total_amount_dollars,
  };
};
