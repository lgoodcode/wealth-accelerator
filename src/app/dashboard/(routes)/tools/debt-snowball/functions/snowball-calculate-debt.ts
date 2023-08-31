import { centsToDollars, dollarsToCents } from '@/lib/utils/currency';
import type { Debt } from '@/lib/types/debts';
import type { SnowballDebtCalculation, DebtPayoff } from '../types';

const NUM_OF_MONTHS = 12;

export const snowball_calculate = (
  debts: Debt[],
  options: {
    isWealthAccelerator: boolean;
    additional_payment: number;
    lump_amounts: number[];
    pay_back_loan: boolean;
    pay_interest: boolean;
    loan_interest_rate: number;
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
  const loan_payment_tracking: number[][] = [Array.from({ length: 12 }, () => 0)];
  const intitial_total_debt = debts.reduce((acc, debt) => acc + dollarsToCents(debt.amount), 0);
  const lump_amounts = options.lump_amounts?.map(dollarsToCents) ?? [];
  const additional_payment = options.additional_payment
    ? dollarsToCents(options.additional_payment)
    : 0;
  const loan_payoffs = [...lump_amounts];
  const monthly_payment = debts.reduce((acc, debt) => acc + dollarsToCents(debt.payment), 0);
  const loan_interest_rate = options.loan_interest_rate / 100 / 12;
  let balance_remaining = intitial_total_debt;
  let year = 0;
  let month = 0;
  let snowball = 0;
  let loan_interest = 0;
  let loan_payback_months = 0;

  // Initialize the debt remaining for the first month
  balance_tracking[0][0] = intitial_total_debt;

  while (balance_remaining) {
    // If we are using the Wealth Accelerator, apply the lump sum to the snowball to use for the debts
    snowball = options.isWealthAccelerator && lump_amounts?.[year] ? lump_amounts[year] : 0;

    for (month = 0; month < NUM_OF_MONTHS; month++) {
      // Add the additional monthly payments after tracking snowball at the start of the month
      snowball += options.additional_payment ? additional_payment : 0;

      // Calculate loan interest only for loans that have been taken out - use the year to only calculate for
      // loans after they have been taken out
      if (options.isWealthAccelerator) {
        for (let i = 0; i <= year; i++) {
          if (loan_payoffs[i]) {
            const interest = loan_payoffs[i] * loan_interest_rate;
            loan_payoffs[i] += interest;
            loan_interest += interest;
          }
        }
      }

      for (const debtPayoff of debt_payoffs) {
        const { debt } = debtPayoff;
        // If the debt is paid off, add the debt's payment to the snowball
        if (!debt.amount) {
          snowball += debt.payment;
          continue;
        }

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
      loan_payment_tracking[year] = Array.from({ length: 12 }, () => 0);
      debt_payoffs.forEach((debtPayoff) => {
        debtPayoff.payment_tracking[year] = Array.from({ length: 12 }, () => 0);
      });
    }
  } // End of years - no more balance remaining

  /**
   * If paying the loan back, use any remainder snowball and the monthly payments to pay
   * back the loan. Otherwise, set the loan payment tracking to an empty array
   */

  if (!options.pay_back_loan) {
    loan_payment_tracking[year] = [];
  } else {
    // If we are only paying interest, then set to the balance to the total loan interest
    let loan_balance_remaining = options.pay_interest
      ? loan_interest
      : loan_payoffs.reduce((acc, lump_amount) => acc + lump_amount, 0);
    let first = true;

    // If there is any loan remaining, use the monthly payments to pay it off and continue
    // tracking it in the balance tracking
    while (loan_balance_remaining) {
      // Reset the month if we are starting a new year
      if (month === NUM_OF_MONTHS) {
        month = 0;
      }

      // Set the initial payment for the month to the monthly payment plus any snowball remaining
      for (; month < NUM_OF_MONTHS; month++) {
        // On the initial payment, we use the snowball because it is the same month as paying off the debts
        // and we can't use more money than we have
        let payment = first ? snowball : monthly_payment;
        // Track the payment used for each month
        loan_payment_tracking[year][month] = payment;

        // Iterate through each debt to properly calculate interest on each loan lump amount
        for (let i = 0; i < loan_payoffs.length; i++) {
          // If there is any balance left for this loan, calculate the interest
          if (loan_payoffs[i]) {
            const interest = loan_payoffs[i] * loan_interest_rate;
            loan_payoffs[i] += interest;
            loan_interest += interest;

            // Make a payment towards the loan if we have any payment remaining
            if (payment) {
              // If we want to only pay the interest, then only pay intereset and deduced interest from the loan payoff
              if (options.pay_interest) {
                if (payment > interest) {
                  payment -= interest;
                  loan_interest -= interest;
                  loan_payoffs[i] -= interest;
                } else {
                  loan_payoffs[i] -= payment;
                  loan_interest -= payment;
                  payment = 0;
                }
              } else {
                if (payment > loan_payoffs[i]) {
                  payment -= loan_payoffs[i];
                  loan_payoffs[i] = 0;
                } else {
                  loan_payoffs[i] -= payment;
                  payment = 0;
                }
              }
            }
          }
        } // End of for-each loan lump amount

        // On the first payment, we are in the same month as paying off debts so we use the snowball
        // and don't increment the month
        if (first) {
          first = false;
        } else {
          loan_payback_months++;
        }

        loan_balance_remaining = loan_payoffs.reduce((acc, lump_amount) => acc + lump_amount, 0);

        // If there is no more loan remaining, remove any empty months, add any remaining payment back into
        // the snowball to be used to deduct from the total  at the end and break out of the loop
        if (!loan_balance_remaining) {
          break;
        }
      } // End of for-each month

      if (loan_balance_remaining) {
        loan_payment_tracking[++year] = Array.from({ length: 12 }, () => 0);
      } else {
        loan_payment_tracking[year] = loan_payment_tracking[year].slice(0, month + 1);
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

  const loan_total =
    lump_amounts?.reduce((acc, lump_amount) => acc + lump_amount, 0) ?? 0 + loan_interest;
  const loan_interest_dollars = centsToDollars(loan_total + loan_interest);
  const loan_tracking_dollars = loan_payment_tracking.map((year) => year.map(centsToDollars));

  return {
    debt_payoffs: debt_payoffs_dollars,
    balance_tracking: balance_tracking_dollars,
    interest_tracking: interest_tracking_dollars,
    snowball_tracking: snowball_tracking_dollars,
    payoff_months: payoff_months,
    total_interest: total_interest_dollars,
    total_amount: total_amount_dollars,
    loan_payback: {
      total: options.pay_back_loan ? loan_interest_dollars : 0,
      interest: options.pay_back_loan ? centsToDollars(loan_interest) : 0,
      months: options.pay_back_loan ? loan_payback_months : 0,
      tracking: loan_tracking_dollars,
    },
  };
};
