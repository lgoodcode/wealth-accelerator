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
}

export function Spinner({ className, size = 'default' }: SpinnerProps) {
  return (
    <span
      className={cn(
        'animate-spin border-white border-b-transparent dark:border-primary-foreground dark:border-b-transparent border-2 rounded-[50%] box-border inline-block',
        sizes[size],
        className
      )}
    ></span>
  );
}
