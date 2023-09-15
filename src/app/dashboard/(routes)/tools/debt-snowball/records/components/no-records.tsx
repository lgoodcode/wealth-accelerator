import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function NoRecords() {
  return (
    <div className="flex justify-center text-center">
      <Card className="max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">No Records Found</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Link href="/dashboard/tools/debt-snowball" className="text-lg link underline">
            Visit the Debt Snowball page and save a record
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
