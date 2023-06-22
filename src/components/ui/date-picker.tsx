'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { atom, useAtom } from 'jotai';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  initialDate?: Date;
  placeholder?: string;
  variant?: Variant;
  // Disable because the value is passed to a callback function.
  // eslint-disable-next-line no-unused-vars
  onSelect?: (date: Date | undefined) => void;
}

const dateAtom = atom<Date | undefined>(undefined);

export function DatePicker({
  className,
  initialDate,
  onSelect,
  placeholder = 'Select a date',
  variant = 'outline',
  ...props
}: DatePickerProps) {
  const [date, setDate] = useAtom(dateAtom);
  const handleSelect = React.useCallback(
    (date: Date | undefined) => {
      setDate(date);
      onSelect?.(date);
    },
    [onSelect, setDate]
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
        <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
