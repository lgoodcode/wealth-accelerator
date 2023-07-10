import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NoRecordCardProps {
  record_id: string;
}

export function NoRecordCard({ record_id }: NoRecordCardProps) {
  return (
    <div className="flex mt-32 justify-center text-center">
      <Card className="max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">No Record Found</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">No record found with id: {record_id}</CardContent>
      </Card>
    </div>
  );
}
