import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { TestingContent } from './testing-content';

export const metadata: Metadata = {
  title: 'Testing',
};

export default function TestPage() {
  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Testing</h2>
      </div>
      <Separator className="mt-6" />
      <div className="flex justify-center mt-8 mx-auto lg:w-[640px]">
        <TestingContent />
      </div>
    </div>
  );
}
