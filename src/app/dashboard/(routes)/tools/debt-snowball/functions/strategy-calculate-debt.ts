import { moneyRound } from '@/lib/utils/money-round';
import type { Debt } from '@/lib/types/debts';
import type { StrategyDebtCalculation, DebtPayoff } from '../types';

const NUM_OF_MONTHS = 12;

export const strategy_calculate = (
  debts: Debt[],
  options?: {
    isDebtSnowball?: boolean;
    isWealthAccelerator?: boolean;
    additional_payment?: number;
    lump_amounts?: number[];
  }
): StrategyDebtCalculation => {
  // Track the debt payoffs by initializing an array of the debts in a DebtPayoff object
  const debt_payoffs: DebtPayoff[] = debts.map((debt) => ({
    debt: structuredClone(debt),
    months: 0,
    total: 0,
    interest: 0,
    payment_tracking: [Array.from({ length: 12 }, () => 0)],
  }));
  // Track the total amount of debt remaining for each month and year using an array with the years and months as indices
  // with the first index being an array of 12 months
  const balance_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const interest_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const snowball_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  // Track the balance for each debt with the inner array index value being the debt amount
  // Track the total debt remaining
  const intitial_total_debt = debts.reduce((acc, debt) => acc + debt.amount, 0);
  let balance_remaining = intitial_total_debt;
  let year = 0;
  let snowball = 0;
  let spillover = 0;

  // Initialize the debt remaining for the first month
  balance_tracking[0][0] = balance_remaining;

  while (balance_remaining) {
    // If a debt is paid off, use the remainder for the next debt
    // If we are using the Wealth Accelerator, apply the lump sum to the snowball to use for the debts
    snowball = options?.isWealthAccelerator ? options?.lump_amounts?.[year] ?? 0 : 0;

    for (let month = 0; month < NUM_OF_MONTHS; month++) {
      // If we are using the debt snowball strategy, add up the debt payments for any debts that are
      // paid off to use to pay towards other debts if we are using
      // the debt snowball strategy
      if (options?.isDebtSnowball) {
        snowball += debt_payoffs.reduce(
          (acc, debtPayoff) => acc + (debtPayoff.debt.amount ? 0 : debtPayoff.debt.payment),
          0
        );
      }

      // If we are using the Wealth Accelerator strategy, separate the lump sum from the snowball tracking
      if (options?.isWealthAccelerator && month === 0 && options?.lump_amounts?.[year]) {
        snowball_tracking[year][month] = moneyRound(snowball - options?.lump_amounts?.[year]);
      } else {
        snowball_tracking[year][month] = moneyRound(snowball);
      }

      // Add the additional monthly payments after tracking snowball
      if (options?.isDebtSnowball) {
        snowball += options?.additional_payment ?? 0;
      }

      for (const debtPayoff of debt_payoffs) {
        const { debt } = debtPayoff;
        const payment = debt.payment + snowball;

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
          debtPayoff.payment_tracking[year][month] = moneyRound(debt.amount);

          if (options?.isDebtSnowball) {
            snowball = moneyRound(payment - debt.amount);
            spillover = snowball;
          }

          debt.amount = 0;
        } else {
          debtPayoff.payment_tracking[year][month] = moneyRound(payment);
          debt.amount = moneyRound(debt.amount - payment);
          snowball = 0;
        }

        // If there is remainder from the snowball, apply it to the first debt with a balance
        if (options?.isDebtSnowball) {
          for (const debtPayoff of debt_payoffs) {
            if (!spillover) {
              break;
            }

            if (debtPayoff.debt.amount) {
              debtPayoff.debt.amount = moneyRound(debtPayoff.debt.amount - spillover);
              debtPayoff.payment_tracking[year][month] = moneyRound(
                debtPayoff.payment_tracking[year][month] + spillover
              );
              spillover = debtPayoff.debt.amount < 0 ? Math.abs(debtPayoff.debt.amount) : 0;
            }
          }
        }
      }

      // After running through each debt for the month, calculate the new total debt remaining
      balance_remaining = debt_payoffs.reduce((acc, debtPayoff) => acc + debtPayoff.debt.amount, 0);

      // Update the debt tracking for the month
      balance_tracking[year][month] = moneyRound(balance_remaining);

      // If there is no more debt remaining, remove the remaining empty months and break out of the loop
      if (!balance_remaining) {
        balance_tracking[year] = balance_tracking[year].slice(0, month + 1);
        break;
      }
    } // End of for-each month

    // If there's still an outstanding balance - increment the year and
    // add a new array of 12 months to the debt tracking
    if (balance_remaining) {
      year++;
      balance_tracking[year] = Array.from({ length: 12 }, () => 0);
      interest_tracking[year] = Array.from({ length: 12 }, () => 0);
      snowball_tracking[year] = Array.from({ length: 12 }, () => 0);
      debt_payoffs.forEach((debtPayoff) => {
        debtPayoff.payment_tracking[year] = Array.from({ length: 12 }, () => 0);
      });
    }
  }

  const total_interest = debt_payoffs.reduce((acc, debtPayoff) => acc + debtPayoff.interest, 0);
  // Find the longest payoff months to determine the payoff date
  const payoff_months = debt_payoffs.reduce(
    (acc, debtPayoff) => Math.max(acc, debtPayoff.months),
    0
  );
  // Calculate the total amount paid for all debts with the principal and interest and subtracting the snowball
  const total_amount = intitial_total_debt + total_interest;

  return {
    debt_payoffs,
    balance_tracking,
    interest_tracking,
    snowball_tracking,
    payoff_months: payoff_months,
    total_interest: moneyRound(total_interest),
    total_amount: moneyRound(total_amount),
  };
};
