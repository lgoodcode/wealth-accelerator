'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DayPickerSingleProps } from 'react-day-picker';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  initialDate?: Date;
  variant?: Variant;
  onChange?: (date: Date | undefined) => void;
  calendarProps?: DayPickerSingleProps;
}

export function DatePicker({
  className,
  initialDate,
  onChange,
  calendarProps,
  placeholder = 'Select a date',
  variant = 'outline',
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const handleSelect = React.useCallback(
    (date: Date | undefined) => {
      setDate(date);
      onChange?.(date);
    },
    [onChange, setDate]
  );

  React.useEffect(() => {
    if (initialDate && !date) {
      setDate(initialDate);
    }
  }, [date, initialDate, setDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}
