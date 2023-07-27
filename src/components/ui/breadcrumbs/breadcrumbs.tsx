import Link from 'next/link';

import { cn } from '@/lib/utils/cn';
import './breadcrumbs.css';

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  href?: string;
}

export const BreadcrumbItem = ({ children, className = '', href }: BreadcrumbProps) => {
  if (href) {
    return (
      <li className={cn('flex items-center select-none', className)}>
        <Link href={href} className="flex items-center cursor-pointer">
          {children}
        </Link>
      </li>
    );
  }

  return <li className={cn('flex items-center', className)}>{children}</li>;
};

export const Breadcrumbs = ({ children, className = '' }: BreadcrumbProps) => {
  return (
    <div className={cn('breadcrumbs overflow-x-auto py-2 text-sm', className)}>
      <ul className="flex items-center whitespace-nowrap min-h-fit">{children}</ul>
    </div>
  );
};
