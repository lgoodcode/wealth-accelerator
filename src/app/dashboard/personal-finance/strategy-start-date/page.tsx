import { Separator } from '@/components/ui/separator';
import { DateForm } from './date-form';

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Strategy Start Date</h3>
        <p className="text-sm text-muted-foreground">
          Specify the month and year that you want to start comparing the strategy timeframe.
        </p>
      </div>
      <Separator />
      <DateForm />
    </div>
  );
}
