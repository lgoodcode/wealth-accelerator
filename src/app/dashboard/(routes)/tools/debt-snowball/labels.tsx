export const labels = {
  additionalPayment: {
    title: 'Additional Monthly Payment',
    description: 'Additional amount of money you can put towards your debt each month.',
  },
  monthlyPayment: {
    title: 'Current Monthly Payment',
    description: (
      <div className="flex flex-col gap-1">
        <span>The amount of money you can put towards your debt each month.</span>
        <span>
          (This value is derived from the &quot;Additional monthly payments&quot; field and the sum
          of the &quot;payment&quot; from the debts.)
        </span>
      </div>
    ),
  },
  opportunityRate: {
    title: 'Opportunity Cost Recovery Rate',
    description: 'The rate to compound your savings for each month from the debt snowball.',
  },
  strategy: {
    title: 'Strategy',
    description: 'The strategy to use for paying off your debt.',
  },
  wealthAcceleratorOptions: {
    title: 'Wealth Accelerator Options',
    description: 'Customize your loan amounts and if you want to pay off the loan.',
  },
  payBackLoan: {
    title: 'Pay Back Loan',
    description:
      'Calculates the payments necessary to pay back the loan taken out to pay off the debt.',
  },
  loanInterestRate: {
    title: 'Loan Interest Rate',
    description:
      'The rate to compound the loan amounts taken, beginning when each lump sum is taken out.',
  },
  loanAmounts: {
    title: 'Loan Amounts',
  },
};
