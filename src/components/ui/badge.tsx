import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex select-none items-center border rounded-full px-4 py-1.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary border-transparent text-primary-foreground dark:font-semibold',
        secondary: 'bg-secondary border-transparent text-secondary-foreground',
        destructive:
          'bg-destructive dark:bg-destructive/20 border-2 border-destructive text-destructive-foreground dark:text-destructive',
        success: 'bg-success dark:bg-success/40 border-2 border-success text-success-foreground',
        warning: 'bg-warning dark:bg-warning/20 border-[1px] border-warning text-warning  ',
        outline: 'text-foreground',
      },
      size: {
        default: 'text-xs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-md',
        xl: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
