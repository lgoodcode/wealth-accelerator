import { cn } from '@/lib/utils/cn';

interface ClientErrorProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

export function ClientError({
  className,
  title = 'An error has occurred',
  children,
}: ClientErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-6 mt-32 items-center justify-center pointer-events-none select-none',
        className
      )}
    >
      <h1 className="text-4xl font-medium">{title}</h1>
      <span className="text-lg">{children || 'Reload the page and try again.'}</span>
    </div>
  );
}
