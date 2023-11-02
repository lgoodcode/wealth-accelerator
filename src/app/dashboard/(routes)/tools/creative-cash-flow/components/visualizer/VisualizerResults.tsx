'use client';

import { Graph } from './Graph';

const GRAPH_WIDTH = 360;
const GRAPH_HEIGHT = 240;

export function VisualizerResults() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <Graph label="Collections" dataKey="collections" width={GRAPH_WIDTH} height={GRAPH_HEIGHT} />
      <Graph label="Recommended WAA" dataKey="waa" width={GRAPH_WIDTH} height={GRAPH_HEIGHT} />
    </div>
  );
}
