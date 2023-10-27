'use client';

import { Graph } from './Graph';

const GRAPH_WIDTH = 360;
const GRAPH_HEIGHT = 240;

export function VisualizerResults() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <Graph label="Collections" dataKey="collections" width={GRAPH_WIDTH} height={GRAPH_HEIGHT} />
      <Graph
        label="Business Overhead"
        dataKey="business_overhead"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
      />
      <Graph
        label="Tax on Business Profit"
        dataKey="tax_account"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
      />
      <Graph
        label="Lifestyle Expenses"
        dataKey="lifestyle_expenses"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
      />
      <Graph
        label="Lifestyle Expense Taxes"
        dataKey="lifestyle_expenses_tax"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
      />
      <Graph
        label="Business Profit Before Taxes"
        dataKey="business_profit_before_tax"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
      />
      <Graph label="Recommended WAA" dataKey="waa" width={GRAPH_WIDTH} height={GRAPH_HEIGHT} />
    </div>
  );
}
