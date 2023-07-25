import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DebtCalculation } from '../types';

interface ResultsCardProps {
  title: string;
  data: DebtCalculation;
}

export function ResultsCard({ title, data }: ResultsCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="pt-4"></CardContent>
    </Card>
  );
}
