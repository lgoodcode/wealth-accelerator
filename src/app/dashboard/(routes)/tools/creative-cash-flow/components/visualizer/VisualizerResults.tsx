'use client';

import { useState } from 'react';
import { ParentSize } from '@visx/responsive';
import { AreaChart, Table } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart } from './BarChart';
import { VisualizeResultsTable } from './table/visualize-results-table';

enum DataTabs {
  Collections = 'collections',
  WAA = 'waa',
}

enum ViewTabs {
  Graph = 'graph',
  Table = 'table',
}

export function VisualizerResults() {
  const [activeDataTab, setActiveDataTab] = useState<DataTabs>(DataTabs.Collections);
  const [activeViewTab, setActiveViewTab] = useState<ViewTabs>(ViewTabs.Graph);
  const handleDataTabChange = (value: string) =>
    setActiveDataTab(value === 'collections' ? DataTabs.Collections : DataTabs.WAA);
  const handleViewTabChange = (value: string) =>
    setActiveViewTab(value === 'graph' ? ViewTabs.Graph : ViewTabs.Table);

  return (
    <div className="w-full h-full flex flex-col flex-grow gap-8">
      <div className="flex justify-between">
        <Tabs className="w-full" value={activeDataTab} onValueChange={handleDataTabChange}>
          <TabsList className="relative grid w-[360px] grid-cols-2">
            <TabsTrigger value={DataTabs.Collections} disabled={activeViewTab === ViewTabs.Table}>
              Collections
            </TabsTrigger>
            <TabsTrigger value={DataTabs.WAA} disabled={activeViewTab === ViewTabs.Table}>
              WAA
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs className="w-full" value={activeViewTab} onValueChange={handleViewTabChange}>
          <TabsList className="relative grid w-fit grid-cols-2 ml-auto">
            <TabsTrigger value={ViewTabs.Graph}>
              <AreaChart size={20} />
            </TabsTrigger>
            <TabsTrigger value={ViewTabs.Table}>
              <Table size={20} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeViewTab === ViewTabs.Graph && (
        <>
          {activeDataTab === DataTabs.Collections && (
            <ParentSize>
              {({ width, height }) => (
                <BarChart dataKey="collections" width={width} height={height} />
              )}
            </ParentSize>
          )}
          {activeDataTab === DataTabs.WAA && (
            <ParentSize>
              {({ width, height }) => <BarChart dataKey="waa" width={width} height={height} />}
            </ParentSize>
          )}
        </>
      )}

      {activeViewTab === ViewTabs.Table && (
        <Card className="w-fit mx-auto">
          <CardContent>
            <VisualizeResultsTable />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
