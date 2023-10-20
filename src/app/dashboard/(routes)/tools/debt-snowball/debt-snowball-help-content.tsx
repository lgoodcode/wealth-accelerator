import Link from 'next/link';

export const DebtSnowballHelpContent = (
  <div className="space-y-4">
    <p>
      Using the debt information provided, you can specify parameters such as the amount of money
      you will put towards your debt each month, in addition to the sum of the payments you already
      have set on each debt. You can select a strategy to use to pay off your debt, and the
      application will calculate the time it will take to pay off your debt, as well as the total
      interest you will pay.
    </p>
    <p>
      The Wealth Accelerator strategy gives you the option to specify lump sum amounts that you can
      put towards your debt for any year. This can be useful if you are expecting a bonus or other
      lump sum amount in the future. You can also choose to pay back a loan, which will be treated
      like a debt, and set an interest rate on the loan payback amount.
    </p>
    <p>
      Note: To use this feature, you need to have debts created in the{' '}
      <Link href="/dashboard/finance/debts" className="link">
        debts
      </Link>{' '}
      feature.
    </p>
  </div>
);
