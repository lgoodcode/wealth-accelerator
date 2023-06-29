import { cn } from '@/lib/utils/cn';
import { Spinner } from '@/components/ui/spinner';

interface LoadingProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

export function Loading({ className, title = 'Loading...', children }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-row mt-32 items-center justify-center pointer-events-none select-none',
        className
      )}
    >
      <Spinner className="mr-4" size="xl" />
      <h1 className="text-4xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}

export default Loading;
