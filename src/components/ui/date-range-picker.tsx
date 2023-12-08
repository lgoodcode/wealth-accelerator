'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  selected?: DateRange;
  from?: Date;
  to?: Date;
  onSelect?: (dateRange: DateRange | undefined) => void;
  onOpenChange?: (isOpen: boolean) => void;
  text?: string;
}

export function DateRangePicker({
  className,
  selected,
  from,
  to,
  onSelect,
  onOpenChange,
  text = 'Filter Dates',
}: DateRangePickerProps) {
  const date = selected ?? { from, to };
  const [isOpen, setIsOpen] = React.useState(false);
  const isRangeSelected = date.from && date.to;

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (selectedRange) {
      const { from: newFrom, to: newTo } = selectedRange;
      if (isRangeSelected && newFrom && !newTo) {
        // Keep the existing "from" date and update the "to" date
        onSelect?.({ from: date.from, to: newFrom });
      } else {
        onSelect?.(selectedRange);
      }
      setIsOpen(!isRangeSelected || newTo !== undefined); // Close the Popover when the second date is selected
    }
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            size="sm"
            className={cn(
              'w-auto justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>{text}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
