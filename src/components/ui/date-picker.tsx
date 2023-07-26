'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DayPickerSingleProps } from 'react-day-picker';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  date?: Date;
  variant?: Variant;
  onSelect?: (date: Date | undefined) => void;
  calendarProps?: Omit<DayPickerSingleProps, 'mode'>;
  onOpenChange?: (isOpen: boolean) => void;
}

export function DatePicker({
  className,
  date,
  onSelect,
  calendarProps,
  placeholder = 'Pick a date',
  variant = 'outline',
  onOpenChange,
  ...props
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect?.(selectedDate);
    setIsOpen(false); // Close the Popover when a date is selected
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
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
