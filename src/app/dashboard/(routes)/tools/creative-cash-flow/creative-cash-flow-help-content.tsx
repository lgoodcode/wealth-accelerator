import Link from 'next/link';

export const CreativeCashFlowHelpContent = (
  <div className="space-y-6">
    <div className="space-y-4">
      <p>
        This will utilize all of the transactions from the institutions you connected in the{' '}
        <Link href="/dashboard/finance/banking" className="link">
          Banking
        </Link>{' '}
        feature to create a cash flow to visualize your income and expenses.
      </p>
      <p>
        Select the date range (inclusive) for the transactions that you want to use as well as any
        additional options that fit your financial profile and calculate the results.
      </p>
      <p>
        Note: A WAA account, which you can set in the{' '}
        <Link href="/dashboard/finance/banking" className="link">
          banking
        </Link>{' '}
        feature, the Creative Cash Flow can pull your current balance and save that to view your
        savings over time.
      </p>
    </div>

    <h1 className="text-xl font-semibold capitalize text-primary">Understanding your results</h1>

    <div className="space-y-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg text-primary font-medium">Trends</h3>
          <p>
            Without an understanding of Trends, it&apos;s unlikely you will know what they can
            reveal and what you can do to change or improve your results.
          </p>
          <ol className="pl-8 !mt-2 list-decimal space-y-1">
            <li>Show you your 30-day, 60-day and 90-day results.</li>
            <li>
              Reveal the direction your collections are heading, forcing you to place your attention
              on how well you are doing, relative to your collection objectives.
            </li>
            <li>
              Everything in business success begins and ends with money, however marketing and
              internal operations are the other 2 players that enable and empower success. The
              amount of collections will determine how efficient and effective you are at attracting
              and retaining patients, and will determine how effective your internal operations are
              functioning.
            </li>
            <li>
              If you are deficient in money supply, it is generally due to poor public perception,
              i.e., you do not have a service that is perceived as highly valuable. So, shortage of
              money can be traced back to poor public perception.
            </li>
            <li>No or not enough $$ = low or no perceived value.</li>
            <li>
              Tracking your trends weekly will alert you to the aspect of your business that is
              underperforming.
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
);
