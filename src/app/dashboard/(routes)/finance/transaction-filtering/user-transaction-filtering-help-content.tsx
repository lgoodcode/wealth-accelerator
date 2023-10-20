export const UserTransactionFilteringHelpContent = (
  <div className="space-y-4">
    <p>
      Here, you can specify filters, that are text, that will be matched against transactions. When
      they match any text (case-insensitive), they will be asigned the category that you select.
    </p>
    <p>
      An override is used to specify that a transaction should be assigned a category, even if they
      are already assigned to another filter. User specified filters here can override any set by
      admins or ones that you set by checking the appropriate box.
    </p>
  </div>
);
