import { moneyRound } from '@/lib/utils/money-round';
import type { Debt } from '@/lib/types/debts';
import type { SnowballDebtCalculation, DebtPayoff } from '../types';

const NUM_OF_MONTHS = 12;

export const snowball_calculate = (
  debts: Debt[],
  options?: {
    isWealthAccelerator?: boolean;
    additional_payment?: number;
    lump_amounts?: number[];
  }
): SnowballDebtCalculation => {
  // Track the debt payoffs by initializing an array of the debts in a DebtPayoff object
  const debt_payoffs: DebtPayoff[] = debts.map((debt) => ({
    debt: {
      ...debt,
      // Get the cents from the dollars to
      amount: debt.amount * 100,
      payment: debt.payment * 100,
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
  const snowball_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const intitial_total_debt = debts.reduce((acc, debt) => acc + debt.amount * 100, 0); // Get the cents from the dollars
  let balance_remaining = intitial_total_debt;
  let year = 0;
  let snowball = 0;

  // Initialize the debt remaining for the first month
  balance_tracking[0][0] = intitial_total_debt;

  while (balance_remaining) {
    // // If a debt is paid off, use the remainder for the next debt
    // // If we are using the Wealth Accelerator, apply the lump sum to the snowball to use for the debts
    // snowball = options?.isWealthAccelerator ? options?.lump_amounts?.[year] ?? 0 : 0;

    for (let month = 0; month < NUM_OF_MONTHS; month++) {
      // // If we are using the Wealth Accelerator strategy, separate the lump sum from the snowball tracking
      // if (options?.isWealthAccelerator && month === 0 && options?.lump_amounts?.[year]) {
      //   snowball_tracking[year][month] = moneyRound(snowball - options?.lump_amounts?.[year]);
      // } else {
      //   snowball_tracking[year][month] = moneyRound(snowball);
      // }

      // Add the additional monthly payments after tracking snowball at the start of the month
      snowball += options?.additional_payment ?? 0;

      for (const debtPayoff of debt_payoffs) {
        const { debt } = debtPayoff;

        // If the debt is paid off, add the debt's payment to the snowball
        if (!debt.amount) {
          snowball += debt.payment;
          continue;
        }

        // Calculate the amortized interest for the month:
        //   Divide by 100 to get the percentage, then divide by 12 to get the monthly interest
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

          // Add the remaining amount leftover to the snowball to be applied for the second round
          snowball += debt.payment - debt.amount;
          debt.amount = 0;
          // Otherwise, use the payment towards the debt amount
        } else {
          debtPayoff.payment_tracking[year][month] = debt.payment;
          debt.amount -= debt.payment;
        }
      } // End of for-each debt

      // Update the snowball tracking for the month
      snowball_tracking[year][month] = snowball;

      // After paying each debt with their respective payment, if we have any snowball money left over
      // begin iterating through each debt again until it is all used up
      for (const debtPayoff of debt_payoffs) {
        const { debt } = debtPayoff;

        if (debt.amount) {
          // If the debt amount remaining is less than the snowball
          if (debt.amount < snowball) {
            // Take the debt amount and use it for the snowball payment for this month for this debt
            // and add it to the payment tracking for the month because we are using it towards the debt
            debtPayoff.payment_tracking[year][month] += debt.amount;

            // Deduct the debt amount from the snowball
            snowball -= debt.amount;
            debt.amount = 0;
            // Otherwise, use the snowball towards the debt amount and break out of the loop
          } else {
            debtPayoff.payment_tracking[year][month] += snowball;
            debt.amount -= snowball;
            snowball = 0;
            break;
          }
        }
      } // End of for-each debt snowball application

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
      snowball_tracking[year] = Array.from({ length: 12 }, () => 0);
      debt_payoffs.forEach((debtPayoff) => {
        debtPayoff.payment_tracking[year] = Array.from({ length: 12 }, () => 0);
      });
    }
  } // End of years - no more balance remaining

  const total_interest = debt_payoffs.reduce((acc, debtPayoff) => acc + debtPayoff.interest, 0);
  const total_interest_dollars = moneyRound(total_interest / 100);
  // Find the longest payoff months to determine the payoff date
  const payoff_months = debt_payoffs.reduce(
    (acc, debtPayoff) => Math.max(acc, debtPayoff.months),
    0
  );
  // Calculate the total amount paid for all debts with the principal and interest and subtracting the snowball
  const total_amount = intitial_total_debt + total_interest - snowball;
  // const total_amount_dollars = moneyRound(total_amount / 100);
  const total_amount_dollars = moneyRound(total_amount / 100);

  // Map all money from cents back into dollars
  const debt_payoffs_dollars = debt_payoffs.map((debtPayoff) => ({
    ...debtPayoff,
    debt: {
      ...debtPayoff.debt,
      amount: moneyRound(debtPayoff.debt.amount / 100),
      payment: moneyRound(debtPayoff.debt.payment / 100),
    },
    interest: moneyRound(debtPayoff.interest / 100),
    payment_tracking: debtPayoff.payment_tracking.map((year) =>
      year.map((month) => moneyRound(month / 100))
    ),
  }));
  const balance_tracking_dollars = balance_tracking.map((year) =>
    year.map((month) => moneyRound(month / 100))
  );
  const interest_tracking_dollars = interest_tracking.map((year) =>
    year.map((month) => moneyRound(month / 100))
  );
  const snowball_tracking_dollars = snowball_tracking.map((year) =>
    year.map((month) => moneyRound(month / 100))
  );

  return {
    debt_payoffs: debt_payoffs_dollars,
    balance_tracking: balance_tracking_dollars,
    interest_tracking: interest_tracking_dollars,
    snowball_tracking: snowball_tracking_dollars,
    payoff_months: payoff_months,
    total_interest: total_interest_dollars,
    total_amount: total_amount_dollars,
  };
};
