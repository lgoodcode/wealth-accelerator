import Link from 'next/link';

import { cn } from '@/lib/utils/cn';
import { ChevronRight } from 'lucide-react';
import { Children } from 'react';

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
}

export const BreadcrumbItem = ({ children, className, href, active }: BreadcrumbProps) => {
  if (href) {
    return (
      <li
        className={cn(
          'select-none px-3 py-2 hover:text-accent-foreground hover:bg-accent inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          className,
          {
            'text-accent-foreground/70': !active,
          }
        )}
      >
        <Link href={href} className="flex items-center cursor-pointer">
          {children}
        </Link>
      </li>
    );
  }

  return (
    <li
      className={cn('flex items-center px-3 py-2', className, {
        'text-accent-foreground/70': !active,
      })}
    >
      {children}
    </li>
  );
};

export const Breadcrumbs = ({ children, className }: BreadcrumbProps) => {
  return (
    <div className={cn('breadcrumbs overflow-x-auto py-2 text-sm', className)}>
      <ul className="flex items-center whitespace-nowrap min-h-fit">
        {Children.map(children, (child, i) => (
          <>
            {i > 0 && <ChevronRight className="mx-1 opacity-70" />}
            {child}
          </>
        ))}
      </ul>
    </div>
  );
};
