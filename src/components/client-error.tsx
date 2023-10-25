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
        'flex flex-row py-32 h-6 items-center justify-center pointer-events-none select-none text-center',
        className
      )}
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-medium">{title}</h1>
        <span className="text-lg text-muted-foreground">Please reload the page and try again.</span>
      </div>
      {children}
    </div>
  );
}
