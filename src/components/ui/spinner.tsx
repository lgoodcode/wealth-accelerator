import { cn } from '@/lib/utils/cn';

const sizes = {
  sm: 'h-2 w-2',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-10 w-10 border-4',
};

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof sizes;
  /**
   * This is used so that the `primary` button variant, which has a white background works while
   * all other variants have a transparent or dark background.
   */
  variant?: 'default' | string | undefined | null;
}

export function Spinner({ className, size = 'md', variant }: SpinnerProps) {
  return (
    <span
      className={cn(
        {
          'border-white border-b-transparent dark:border-primary-foreground dark:border-b-transparent':
            variant === 'default',
          'border-primary border-b-transparent dark:border-white dark:border-b-transparent ':
            variant !== 'default',
        },
        'animate-spin border-2 rounded-[50%] box-border inline-block',
        sizes[size],
        className
      )}
    ></span>
  );
}
