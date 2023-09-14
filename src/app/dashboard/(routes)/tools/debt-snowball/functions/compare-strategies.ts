import { moneyRound } from '@/lib/utils/money-round';
import { currencyOperation } from '@/lib/utils/currency-operations';
import type {
  DebtCalculationInputs,
  DebtCalculationResults,
  DebtSnowballComparison,
} from '../types';

export const compare_strategies = (
  inputs: DebtCalculationInputs,
  results: DebtCalculationResults
): DebtSnowballComparison => {
  const diff_in_months =
    results.currentResults.payoff_months - results.strategyResults.payoff_months;
  let currentSaved = 0;
  let currentCost = 0;
  let strategySaved = 0;
  let strategyCost = 0;
  let currentDateDiff = 0;
  let strategyDateDiff = 0;
  let currentOppCost = 0;
  let strategyOppCost = 0;

  if (results.currentResults.total_amount < results.strategyResults.total_amount) {
    const val = currencyOperation(
      'subtract',
      results.strategyResults.total_amount,
      results.currentResults.total_amount
    );
    currentSaved = strategyCost = val;
    currentDateDiff = -diff_in_months;
    strategyDateDiff = diff_in_months;
  } else if (results.currentResults.total_amount > results.strategyResults.total_amount) {
    const val = currencyOperation(
      'subtract',
      results.currentResults.total_amount,
      results.strategyResults.total_amount
    );
    currentCost = strategySaved = val;
    currentDateDiff = diff_in_months;
    strategyDateDiff = -diff_in_months;
  } else {
    currentSaved = strategySaved = 0;
    currentCost = strategyCost = 0;
    currentDateDiff = strategyDateDiff = 0;
  }

  /**
   * Opportunity Cost
   */

  // If paying off the loan back, subtract the number of months it would take to pay off the
  // loan from the difference in months between the two strategies to get the number of months
  // to calculate the opportunity cost.
  const months = inputs.pay_back_loan
    ? diff_in_months - results.strategyResults.loan_payback.months
    : diff_in_months;

  // If there is an opportunity cost rate set, calculate compound interest by taking the monthly
  // payment and multiplying it by the opportunity rate for difference in months between the
  // two strategies. Otherwise, set the opportunity cost to 0.
  if (inputs.opportunity_rate > 0) {
    const opportunity_rate = inputs.opportunity_rate / 100 / 12;

    if (results.currentResults.total_amount < results.strategyResults.total_amount) {
      for (let i = 0; i < months; i++) {
        if (i === 0) {
          currentOppCost =
            inputs.monthly_payment + moneyRound(inputs.monthly_payment * opportunity_rate);
        } else {
          const interest = moneyRound(currentOppCost * opportunity_rate);
          currentOppCost += inputs.monthly_payment + interest;
        }
      }
    } else {
      for (let i = 0; i < months; i++) {
        if (i === 0) {
          strategyOppCost =
            inputs.monthly_payment + moneyRound(inputs.monthly_payment * opportunity_rate);
        } else {
          const interest = moneyRound(strategyOppCost * opportunity_rate);
          strategyOppCost += inputs.monthly_payment + interest;
        }
      }
    }
    // Otherwise, just multiply the monthly payment by the difference in months
  } else {
    if (results.currentResults.total_amount < results.strategyResults.total_amount) {
      currentOppCost = inputs.monthly_payment * months;
    } else {
      strategyOppCost = inputs.monthly_payment * months;
    }
  }

  return {
    current: {
      saved: currentSaved,
      cost: currentCost,
      dateDiff: currentDateDiff,
      oppCost: currentOppCost,
    },
    strategy: {
      saved: strategySaved,
      cost: strategyCost,
      dateDiff: strategyDateDiff,
      oppCost: strategyOppCost,
    },
  };
};
