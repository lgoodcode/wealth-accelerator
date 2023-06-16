import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import { DatePickerWithRange } from '@/components/date-picker/with-range';
// import { CalendarDateRangePicker } from '../../dashboard/components/date-range-picker';
import { DatePickerWithPresets } from '@/components/calendar/with-presets';
export function DemoDatePicker() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="date" className="shrink-0">
            Pick a date
          </Label>
          <DatePickerWithPresets />
        </div>
      </CardContent>
    </Card>
  );
}
