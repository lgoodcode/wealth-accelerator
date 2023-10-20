export const HelpContent = (
  <div className="space-y-4">
    <p>
      To get started, select the dropdown menu and add an institution. You will be redirected to
      Plaid where you can link your bank account. Note: Plaid is a third-party service that allows
      you to link your bank account to this application. You can read more about Plaid{' '}
      <a
        href="https://plaid.com/legal/#end-user-privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        here
      </a>
    </p>
    <p>
      After successfully connecting your institution, it will begin syncing information from your
      bank with Plaid. This may take a few minutes. Once complete, you will be able to view your
      transactions.
    </p>
    <p>
      The transactions will be categorized once retrieved into one of three categories: Money-In,
      Money-Out, and Transfer. These categories are determined by filters set by your admin, or
      yourself. If there are no filters that the name of the transaction matches, it will be
      categorized by the amount of the transaction. If the amount is positive, it will be
      categorized as Money-In, and if it is negative, it will be categorized as Money-Out. You are
      able to manually change the category of a transaction by selecting the dropdown menu on the
      transaction and selecting a new category.
    </p>
  </div>
);
