import { forwardRef } from 'react';
import { default as Input } from 'react-currency-input-field';
import type { CurrencyInputProps } from 'react-currency-input-field';

import { cn } from '@/lib/utils/cn';

interface CurrencyInputOverrideProps extends Omit<CurrencyInputProps, 'onChange' | 'decimals'> {
  onChange?: (value: any) => void;
}

export const PercentInput = forwardRef<
  Omit<HTMLInputElement, 'onChange'>,
  CurrencyInputOverrideProps
>(({ className, onValueChange, onChange, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      disableAbbreviations={true}
      className={cn(
        'flex text-sm h-10 w-full rounded-md border bg-transparent px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      suffix="%"
      onValueChange={(value = '0') => {
        const floatValue = parseFloat(value);

        if (!isNaN(floatValue) && floatValue >= -100 && floatValue <= 100) {
          (onChange || onValueChange)?.(value);
        }
      }}
      {...props}
    />
  );
});
PercentInput.displayName = 'PercentInput';
