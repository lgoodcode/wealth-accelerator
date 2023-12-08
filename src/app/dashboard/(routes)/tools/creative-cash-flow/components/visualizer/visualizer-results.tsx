'use client';

import { useState } from 'react';
import { ParentSize } from '@visx/responsive';
import { AreaChart, Table } from 'lucide-react';
import type { PaginationState } from '@tanstack/react-table';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart } from './bar-chart';
import { VisualizeResultsTable } from './table/visualize-results-table';

enum DataTabs {
  Collections = 'collections',
  WAA = 'waa',
  AccountBalances = 'account-balances',
}

enum ViewTabs {
  Graph = 'graph',
  Table = 'table',
}

export function VisualizerResults() {
  const [activeDataTab, setActiveDataTab] = useState<DataTabs>(DataTabs.Collections);
  const [activeViewTab, setActiveViewTab] = useState<ViewTabs>(ViewTabs.Graph);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handlePaginationChange = (value: PaginationState) => setPagination(value);

  return (
    <div className="w-full h-full flex flex-col flex-grow gap-8">
      <div className="flex justify-between">
        <Tabs
          className="w-full"
          value={activeDataTab}
          onValueChange={(value: string) => setActiveDataTab(value as DataTabs)}
        >
          <TabsList className="relative grid w-fit grid-cols-3">
            <TabsTrigger value={DataTabs.Collections} disabled={activeViewTab === ViewTabs.Table}>
              Collections
            </TabsTrigger>
            <TabsTrigger value={DataTabs.WAA} disabled={activeViewTab === ViewTabs.Table}>
              WAA
            </TabsTrigger>
            <TabsTrigger
              value={DataTabs.AccountBalances}
              disabled={activeViewTab === ViewTabs.Table}
            >
              Account Balances
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          className="w-full"
          value={activeViewTab}
          onValueChange={(value: string) => setActiveViewTab(value as ViewTabs)}
        >
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
          {activeDataTab === DataTabs.AccountBalances && (
            <ParentSize>
              {({ width, height }) => <BarChart dataKey="balance" width={width} height={height} />}
            </ParentSize>
          )}
        </>
      )}

      {activeViewTab === ViewTabs.Table && (
        <Card className="w-fit mx-auto">
          <CardContent>
            <VisualizeResultsTable
              pagination={pagination}
              handlePaginationChange={handlePaginationChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
