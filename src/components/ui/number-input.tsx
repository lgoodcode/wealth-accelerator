import { forwardRef, useState } from 'react';
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field';

import { cn } from '@/lib/utils/cn';

const nonDigitRegex = /\D/g;

type NumberInputProps = CurrencyInputProps & {
  onChange: (value: number | undefined) => void;
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const parse = (value: string) => {
      if (!value) {
        return 0;
      } else if (typeof value === 'number') {
        return Number.isNaN(value) ? 0 : value;
      }

      const parsedValue = parseFloat(value.replace(nonDigitRegex, ''));
      return Number.isNaN(parsedValue) ? undefined : parsedValue;
    };
    const [displayValue, setDisplayValue] = useState<string>(value ? value.toString() : '');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (!value) {
        setDisplayValue('');
        return;
      }

      const parsedValue = parse(value);
      setDisplayValue(!parsedValue ? '' : parsedValue.toString());

      if (onChange) {
        onChange(parsedValue);
      }
    };

    return (
      <CurrencyInput
        ref={ref}
        disableAbbreviations={true}
        className={cn(
          'flex text-sm h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
NumberInput.displayName = 'NumberInput';
