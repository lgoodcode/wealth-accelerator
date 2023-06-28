import { cn } from '@/lib/utils/cn';

const sizes = {
  xs: 'h-2 w-2',
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  default: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-10 w-10 border-4',
};

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof sizes;
  /**
   * This is used so that the `primary` button variant, which has a white background works while
   * all other variants have a transparent or dark background.
   */
  variant?: 'primary' | 'default' | string | undefined | null;
}

export function Spinner({ className, size = 'default', variant = 'other' }: SpinnerProps) {
  return (
    <span
      className={cn(
        'animate-spin border-2 rounded-[50%] box-border inline-block',
        {
          'border-white border-b-transparent dark:border-primary-foreground dark:border-b-transparent':
            variant === 'primary' || variant === 'other',
          'dark:border-white dark:border-b-transparent border-primary-foreground border-b-transparent':
            variant !== 'primary' && variant !== 'other',
        },
        sizes[size],
        className
      )}
    ></span>
  );
}
