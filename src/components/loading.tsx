import { cn } from '@/lib/utils/cn';
import { Spinner } from './ui/spinner';

interface LoadingProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

export function Loading({ className, title = 'Loading...', children, ...props }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-row !mt-32 h-6 items-center justify-center pointer-events-none select-none',
        className
      )}
      {...props}
    >
      <Spinner className="mr-4" size="xxl" />
      <h1 className="text-4xl font-medium">{title}</h1>
      {children}
    </div>
  );
}

export default Loading;
