import { moneyRound } from '@/lib/utils/money-round';
import type { Debt } from '@/lib/types/debts';
import type { SnowballDebtCalculation, DebtPayoff } from '../types';

const NUM_OF_MONTHS = 12;
const dollarsToCents = (dollars: number) => dollars * 100;
const centsToDollars = (cents: number) => moneyRound(cents / 100);

export const snowball_calculate = (
  debts: Debt[],
  options?: {
    isWealthAccelerator?: boolean;
    additional_payment?: number;
    lump_amounts?: number[];
    pay_back_loan?: boolean;
    loan_interest_rate?: number;
  }
): SnowballDebtCalculation => {
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
  const snowball_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const loan_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const intitial_total_debt = debts.reduce((acc, debt) => acc + dollarsToCents(debt.amount), 0);
  const lump_amounts = options?.lump_amounts?.map(dollarsToCents) ?? [];
  const additional_payment = options?.additional_payment
    ? dollarsToCents(options?.additional_payment)
    : 0;
  let balance_remaining = intitial_total_debt;
  let year = 0;
  let month = 0;
  let snowball = 0;
  let loan_total = 0;
  let loan_interest = 0;
  let loan_payback_months = 0;

  // Initialize the debt remaining for the first month
  balance_tracking[0][0] = intitial_total_debt;

  while (balance_remaining) {
    // If we are using the Wealth Accelerator, apply the lump sum to the snowball to use for the debts
    snowball = options?.isWealthAccelerator && lump_amounts?.[year] ? lump_amounts[year] : 0;

    for (month = 0; month < NUM_OF_MONTHS; month++) {
      // Add the additional monthly payments after tracking snowball at the start of the month
      snowball += options?.additional_payment ? additional_payment : 0;

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

      // If there is no more debt remaining, break out of the loop
      if (!balance_remaining) {
        // Remove the extra months only if we aren't paying the loan back
        // otherwise we keep it and remove any empty months at the end
        if (!options?.pay_back_loan) {
          balance_tracking[year] = balance_tracking[year].slice(0, month + 1);
        }
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
      loan_tracking[year] = Array.from({ length: 12 }, () => 0); // Only used for paying back the loan later on
      debt_payoffs.forEach((debtPayoff) => {
        debtPayoff.payment_tracking[year] = Array.from({ length: 12 }, () => 0);
      });
    }
  } // End of years - no more balance remaining

  /**
   * If paying the loan back, use any remainder snowball and the monthly payments to pay back the loan
   */

  if (options?.pay_back_loan) {
    const loan_interest_rate = options?.loan_interest_rate ?? 0;
    const monthly_payment = debts.reduce((acc, debt) => acc + dollarsToCents(debt.payment), 0);
    let loan_balance_remaining = lump_amounts?.reduce((acc, lump_amount) => acc + lump_amount, 0);
    loan_total = loan_balance_remaining;

    // If the snowball is greater than the total loan, subtract the loan from the snowball
    if (snowball > loan_balance_remaining) {
      snowball -= loan_balance_remaining;
      loan_balance_remaining = 0;
      // Otherwise, subtract the snowball from the loan and set the snowball to 0
    } else {
      loan_balance_remaining -= snowball;
      snowball = 0;
    }

    // If there is any loan remaining, use the monthly payments to pay it off and continue
    // tracking it in the balance tracking
    while (loan_balance_remaining) {
      if (month === NUM_OF_MONTHS) {
        month = 0;
      }

      // Set the initial payment for the month to the monthly payment plus any snowball remaining
      for (; month < NUM_OF_MONTHS; month++) {
        const interest = loan_balance_remaining * (loan_interest_rate / 100 / 12);
        loan_interest += interest;
        loan_balance_remaining += interest;
        loan_payback_months++;

        if (monthly_payment > loan_balance_remaining) {
          loan_balance_remaining = 0;
        } else {
          loan_balance_remaining -= monthly_payment;
        }

        loan_tracking[year][month] = loan_balance_remaining;

        // If there is no more loan remaining, remove any empty months, add any remaining payment back into
        // the snowball to be used to deduct from the total  at the end and break out of the loop
        if (!loan_balance_remaining) {
          break;
        }
      }

      if (loan_balance_remaining) {
        loan_tracking[++year] = Array.from({ length: 12 }, () => 0);
      } else {
        loan_tracking[year] = loan_tracking[year].slice(0, month + 1);
        break;
      }
    } // No loan balance remaining
  }

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
  // Calculate the total amount paid for all debts with the principal and interest and subtracting the snowball
  const total_amount = intitial_total_debt + total_interest - snowball;
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
  const snowball_tracking_dollars = snowball_tracking.map((year) => year.map(centsToDollars));

  return {
    debt_payoffs: debt_payoffs_dollars,
    balance_tracking: balance_tracking_dollars,
    interest_tracking: interest_tracking_dollars,
    snowball_tracking: snowball_tracking_dollars,
    payoff_months: payoff_months,
    total_interest: total_interest_dollars,
    total_amount: total_amount_dollars,
    loan_payback: {
      total: centsToDollars(loan_total + loan_interest),
      interest: centsToDollars(loan_interest),
      months: loan_payback_months,
    },
  };
};
