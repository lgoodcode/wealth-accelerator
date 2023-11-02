'use client';

import { useState } from 'react';
import { ParentSize } from '@visx/responsive';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Graph } from './Graph';

enum TabsValue {
  Collections = 'collections',
  WAA = 'waa',
}

export function VisualizerResults() {
  const [activeTab, setActiveTab] = useState<TabsValue>(TabsValue.Collections);
  const handleTabChange = (value: string) =>
    setActiveTab(value === 'collections' ? TabsValue.Collections : TabsValue.WAA);

  return (
    <div className="w-full h-full flex flex-col flex-grow gap-8">
      <Tabs className="w-full" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="relative grid w-[360px] grid-cols-2 mx-auto">
          <TabsTrigger value={TabsValue.Collections}>Collections</TabsTrigger>
          <TabsTrigger value={TabsValue.WAA}>WAA</TabsTrigger>
        </TabsList>
      </Tabs>

      <ParentSize>
        {({ width, height }) => <Graph dataKey={activeTab} width={width} height={height} />}
      </ParentSize>
    </div>
  );
}
